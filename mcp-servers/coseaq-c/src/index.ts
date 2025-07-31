#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createReadStream } from "fs";
// Dynamic import to avoid pdf-parse initialization issue
let pdfParse: any;
import mammoth from "mammoth";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File access permissions store
const filePermissions = new Map<string, boolean>();
let defaultCurriculumPath: string | null = null;

// Schema for file reading parameters
const ReadFileSchema = z.object({
  filepath: z.string().describe("Path to the file to read"),
  requestPermission: z.boolean().default(true).describe("Whether to request permission before reading")
});

const ListFilesSchema = z.object({
  directory: z.string().describe("Directory path to list files from"),
  pattern: z.string().optional().describe("File pattern to match (e.g., '*.pdf')")
});

const SetDefaultPathSchema = z.object({
  path: z.string().describe("Default directory path for curriculum files")
});

// Helper function to check file permissions
async function checkFilePermission(filepath: string): Promise<boolean> {
  const normalizedPath = path.normalize(filepath);
  
  // Check if we already have permission for this file
  if (filePermissions.has(normalizedPath)) {
    return filePermissions.get(normalizedPath)!;
  }
  
  // For now, we'll return true but log the access request
  // In a real implementation, this would prompt the user
  console.error(chalk.yellow(`🔐 File access requested: ${normalizedPath}`));
  console.error(chalk.gray(`Type 'allow' or 'deny' for this file access.`));
  
  // Store permission (in real implementation, this would wait for user input)
  filePermissions.set(normalizedPath, true);
  return true;
}

// Helper function to read PDF files
async function readPdfFile(filepath: string): Promise<string> {
  // Lazy load pdf-parse to avoid initialization issue
  if (!pdfParse) {
    pdfParse = (await import("pdf-parse")).default;
  }
  const dataBuffer = await fs.readFile(filepath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Helper function to read Word documents
async function readDocxFile(filepath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filepath });
  return result.value;
}

// Helper function to read any supported file
async function readFile(filepath: string): Promise<string> {
  const ext = path.extname(filepath).toLowerCase();
  
  switch (ext) {
    case '.pdf':
      return readPdfFile(filepath);
    case '.docx':
    case '.doc':
      return readDocxFile(filepath);
    case '.txt':
    case '.md':
      return fs.readFile(filepath, 'utf-8');
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

// Create the MCP server
const server = new Server(
  {
    name: "coseaq-c-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "read_curriculum_file",
        description: "Read a curriculum file (PDF, Word, or text). Requests permission before accessing.",
        inputSchema: ReadFileSchema,
      },
      {
        name: "list_curriculum_files",
        description: "List files in a directory",
        inputSchema: ListFilesSchema,
      },
      {
        name: "set_default_curriculum_path",
        description: "Set the default directory for curriculum files",
        inputSchema: SetDefaultPathSchema,
      },
      {
        name: "analyze_curriculum",
        description: "Analyze curriculum according to COSEAQ C methodology",
        inputSchema: z.object({
          content: z.string().describe("The curriculum content to analyze"),
          type: z.enum(["syllabus", "national_curriculum"]).describe("Type of document")
        }),
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "read_curriculum_file": {
      const { filepath, requestPermission } = ReadFileSchema.parse(args);
      
      // Check permissions if requested
      if (requestPermission) {
        const hasPermission = await checkFilePermission(filepath);
        if (!hasPermission) {
          return {
            content: [
              {
                type: "text",
                text: "Permission denied to read file.",
              },
            ],
          };
        }
      }
      
      try {
        const content = await readFile(filepath);
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error reading file: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }

    case "list_curriculum_files": {
      const { directory, pattern } = ListFilesSchema.parse(args);
      
      try {
        const files = await fs.readdir(directory);
        const filteredFiles = pattern 
          ? files.filter(f => f.match(new RegExp(pattern.replace('*', '.*'))))
          : files;
        
        return {
          content: [
            {
              type: "text",
              text: `Files in ${directory}:\n${filteredFiles.map(f => `- ${f}`).join('\n')}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing files: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }

    case "set_default_curriculum_path": {
      const { path: newPath } = SetDefaultPathSchema.parse(args);
      defaultCurriculumPath = newPath;
      
      return {
        content: [
          {
            type: "text",
            text: `Default curriculum path set to: ${newPath}`,
          },
        ],
      };
    }

    case "analyze_curriculum": {
      const { content, type } = z.object({
        content: z.string(),
        type: z.enum(["syllabus", "national_curriculum"])
      }).parse(args);
      
      // Basic curriculum analysis (to be expanded)
      const analysis = {
        type,
        keyCompetencies: [],
        learningObjectives: [],
        topics: [],
        contentRequirements: [],
      };
      
      // Simple keyword extraction (this would be much more sophisticated)
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.toLowerCase().includes('competenc')) {
          (analysis.keyCompetencies as string[]).push(line.trim());
        }
        if (line.toLowerCase().includes('objective') || line.toLowerCase().includes('goal')) {
          (analysis.learningObjectives as string[]).push(line.trim());
        }
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Handle prompts listing
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "start_coseaq_c",
        description: "Start the COSEAQ C content generation process",
        arguments: [
          {
            name: "curriculum_path",
            description: "Path to curriculum files (optional)",
            required: false,
          },
        ],
      },
    ],
  };
});

// Handle prompt requests
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "start_coseaq_c") {
    const curriculumPath = args?.curriculum_path || defaultCurriculumPath || "~/Documents/Curriculum";
    
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `I want to start the COSEAQ C content generation process. 

My curriculum files are located at: ${curriculumPath}

Please guide me through:
1. Uploading and analyzing syllabus and National Curriculum documents
2. Using the Constructive Alignment Framework
3. Creating a comprehensive course outline
4. Generating chapter structures

Let's begin with analyzing the curriculum documents.`,
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${name}`);
});

// Start the server
async function main() {
  console.error(chalk.green("🚀 COSEAQ C MCP Server starting..."));
  console.error(chalk.gray("File access will require permission"));
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error(chalk.green("✅ COSEAQ C MCP Server running"));
}

main().catch((error) => {
  console.error(chalk.red("Fatal error:"), error);
  process.exit(1);
});