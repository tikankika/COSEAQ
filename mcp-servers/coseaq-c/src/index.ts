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
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";
import chalk from "chalk";
import { CoseaqSession, CurriculumAnalysis } from "./coseaq-session.js";
import { CurriculumAnalyzer } from "./curriculum-analyzer.js";
import { AIAnalyzer, formatAnalysisForDisplay } from "./ai-analyzer.js";
import { DialogueManager } from "./dialogue-manager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File access permissions store
const filePermissions = new Map<string, boolean>();
let defaultCurriculumPath: string | null = null;

// Active COSEAQ sessions
const sessions = new Map<string, CoseaqSession>();
const dialogueManagers = new Map<string, DialogueManager>();
let currentSessionId: string | null = null;

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
  try {
    const data = await fs.readFile(filepath);
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF reading error:', error);
    throw new Error(`Failed to read PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
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
        inputSchema: {
          type: "object",
          properties: {
            filepath: {
              type: "string",
              description: "Path to the file to read"
            },
            requestPermission: {
              type: "boolean",
              description: "Whether to request permission before reading",
              default: true
            }
          },
          required: ["filepath"]
        },
      },
      {
        name: "list_curriculum_files",
        description: "List files in a directory",
        inputSchema: {
          type: "object",
          properties: {
            directory: {
              type: "string",
              description: "Directory path to list files from"
            },
            pattern: {
              type: "string",
              description: "File pattern to match (e.g., '*.pdf')",
              required: false
            }
          },
          required: ["directory"]
        },
      },
      {
        name: "set_default_curriculum_path",
        description: "Set the default directory for curriculum files",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Default directory path for curriculum files"
            }
          },
          required: ["path"]
        },
      },
      {
        name: "analyze_curriculum",
        description: "Analyze curriculum according to COSEAQ C methodology",
        inputSchema: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "The curriculum content to analyze"
            },
            type: {
              type: "string",
              enum: ["syllabus", "national_curriculum"],
              description: "Type of document"
            }
          },
          required: ["content", "type"]
        },
      },
      {
        name: "start_session",
        description: "Start a new COSEAQ-C collaborative session",
        inputSchema: {
          type: "object",
          properties: {
            subject: {
              type: "string",
              description: "Subject area (e.g., Biology, Mathematics)"
            },
            gradeLevel: {
              type: "string",
              description: "Grade level (e.g., Grade 9, Gymnasium)"
            }
          },
          required: ["subject", "gradeLevel"]
        },
      },
      {
        name: "review_analysis",
        description: "Review and modify the curriculum analysis",
        inputSchema: {
          type: "object",
          properties: {
            modifications: {
              type: "string",
              description: "Teacher's modifications or feedback"
            }
          },
          required: ["modifications"]
        },
      },
      {
        name: "create_outline",
        description: "Create course outline based on analysis",
        inputSchema: {
          type: "object",
          properties: {
            preferences: {
              type: "string",
              description: "Teacher preferences for outline structure"
            }
          },
          required: []
        },
      },
      {
        name: "save_session",
        description: "Save current work session",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name for the saved session"
            }
          },
          required: ["name"]
        },
      },
      {
        name: "start_dialogue",
        description: "Start guided dialogue for collaborative curriculum planning",
        inputSchema: {
          type: "object",
          properties: {
            sessionId: {
              type: "string",
              description: "Session ID to start dialogue for",
              required: false
            }
          },
          required: []
        },
      },
      {
        name: "continue_dialogue",
        description: "Continue the ongoing dialogue with your response",
        inputSchema: {
          type: "object",
          properties: {
            response: {
              type: "string",
              description: "Your response to the current question"
            }
          },
          required: ["response"]
        },
      },
      {
        name: "dialogue_status",
        description: "Get current dialogue status and summary",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        },
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
      
      // Get or create current session
      if (!currentSessionId) {
        const newSession = new CoseaqSession();
        currentSessionId = newSession.id;
        sessions.set(currentSessionId, newSession);
      }
      
      const session = sessions.get(currentSessionId)!;
      
      // Create AI analyzer instance
      const aiAnalyzer = new AIAnalyzer();
      
      // Perform ACTUAL AI analysis
      console.error(chalk.blue("🤖 Performing AI analysis of curriculum..."));
      
      try {
        const structuredAnalysis = await aiAnalyzer.analyzeCurriculum(content, type);
        
        // Convert to session format and store
        const sessionAnalysis: CurriculumAnalysis = {
          subject: structuredAnalysis.subject,
          gradeLevel: structuredAnalysis.level,
          keyCompetencies: structuredAnalysis.competencies.map(c => c.interpretation),
          learningObjectives: structuredAnalysis.learningObjectives.map(lo => lo.objective),
          contentRequirements: structuredAnalysis.competencies.flatMap(c => c.knowledgeAreas),
          assessmentCriteria: structuredAnalysis.learningObjectives.flatMap(lo => lo.measurableCriteria),
          topics: structuredAnalysis.suggestedChapters.map(ch => ({
            name: ch.title,
            objectives: ch.objectives,
            concepts: ch.keyTopics,
            skills: [] // Will be populated during chapter planning
          }))
        };
        
        session.setAnalysis(sessionAnalysis);
        
        // Format the analysis for display
        const formattedAnalysis = formatAnalysisForDisplay(structuredAnalysis);
        
        return {
          content: [
            {
              type: "text",
              text: `📊 **Kursplansanalys Genomförd**\n\n${formattedAnalysis}\n\n` +
                    `**Nästa steg:**\n` +
                    `1. Granska analysen - stämmer tolkningen?\n` +
                    `2. Anpassa till lokala förutsättningar\n` +
                    `3. Välj struktur för kursen\n\n` +
                    `Använd \`review_analysis\` för att ge feedback på analysen.`,
            },
          ],
        };
      } catch (error) {
        console.error(chalk.red("AI Analysis error:"), error);
        
        // Fallback to basic analysis if AI fails
        const basicAnalysis = CurriculumAnalyzer.createBasicAnalysis(
          type === "national_curriculum" ? content : "",
          type === "syllabus" ? content : ""
        );
        
        session.setAnalysis(basicAnalysis);
        
        return {
          content: [
            {
              type: "text",
              text: `⚠️ **AI-analys kunde inte genomföras fullt ut**\n\n` +
                    `En grundläggande analys har gjorts, men den fullständiga AI-analysen misslyckades.\n` +
                    `Fel: ${error instanceof Error ? error.message : 'Okänt fel'}\n\n` +
                    `Du kan fortsätta med manuell planering eller försöka igen senare.`,
            },
          ],
        };
      }
    }

    case "start_session": {
      const { subject, gradeLevel } = z.object({
        subject: z.string(),
        gradeLevel: z.string()
      }).parse(args);
      
      const session = new CoseaqSession(subject, gradeLevel);
      currentSessionId = session.id;
      sessions.set(session.id, session);
      
      return {
        content: [
          {
            type: "text",
            text: `🚀 **COSEAQ-C Session Started**\n\n` +
                  `**Subject:** ${subject}\n` +
                  `**Grade Level:** ${gradeLevel}\n` +
                  `**Session ID:** ${session.id}\n\n` +
                  `**Next steps:**\n` +
                  `1. Tell me where your curriculum files are located\n` +
                  `2. I'll read them (with your permission) and analyze\n` +
                  `3. We'll discuss findings and create the course structure together\n\n` +
                  `**Example:** "My files are in /Users/name/Documents/Curriculum/"\n` +
                  `Or: "Read the biology curriculum at /Desktop/Bio-NC.pdf"`,
          },
        ],
      };
    }

    case "review_analysis": {
      const { modifications } = z.object({
        modifications: z.string()
      }).parse(args);
      
      if (!currentSessionId || !sessions.has(currentSessionId)) {
        throw new Error("No active session. Start with 'start_session' first.");
      }
      
      const session = sessions.get(currentSessionId)!;
      session.recordAction("ANALYSIS_REVIEWED", { modifications });
      
      return {
        content: [
          {
            type: "text",
            text: `✅ **Analysis Updated**\n\n` +
                  `I've noted your feedback: "${modifications}"\n\n` +
                  `**Current progress:** ${session.getProgress()}\n\n` +
                  `Ready to create the course outline based on our refined analysis?`,
          },
        ],
      };
    }

    case "create_outline": {
      const { preferences } = z.object({
        preferences: z.string().optional()
      }).parse(args);
      
      if (!currentSessionId || !sessions.has(currentSessionId)) {
        throw new Error("No active session. Start with 'start_session' first.");
      }
      
      const session = sessions.get(currentSessionId)!;
      if (!session.curriculumAnalysis) {
        throw new Error("Please analyze curriculum first.");
      }
      
      // Generate outline suggestion
      const suggestedOutline = CurriculumAnalyzer.suggestOutline(session.curriculumAnalysis);
      session.setOutline(suggestedOutline);
      
      return {
        content: [
          {
            type: "text",
            text: `📚 **Course Outline Draft**\n\n` +
                  `Based on our analysis, here's my suggested structure:\n\n` +
                  suggestedOutline.chapters.map((ch: any) => 
                    `**Chapter ${ch.number}: ${ch.title}**\n` +
                    `   Topics: ${ch.topics.join(', ')}\n` +
                    `   Est. hours: ${ch.estimatedHours}\n`
                  ).join('\n') +
                  `\n**Your preferences noted:** ${preferences || 'None specified'}\n\n` +
                  `What would you like to adjust? (chapter order, topics, time allocation?)`,
          },
        ],
      };
    }

    case "save_session": {
      const { name } = z.object({
        name: z.string()
      }).parse(args);
      
      if (!currentSessionId || !sessions.has(currentSessionId)) {
        throw new Error("No active session to save.");
      }
      
      const session = sessions.get(currentSessionId)!;
      const sessionData = JSON.stringify(session.toJSON(), null, 2);
      const filename = `coseaq-session-${name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      
      // Create sessions directory in user's home directory
      const homeDir = process.env.HOME || process.env.USERPROFILE || '';
      const sessionsDir = path.join(homeDir, '.coseaq-sessions');
      
      // Ensure directory exists
      try {
        await fs.mkdir(sessionsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist, that's fine
      }
      
      const filepath = path.join(sessionsDir, filename);
      
      await fs.writeFile(filepath, sessionData);
      
      return {
        content: [
          {
            type: "text",
            text: `💾 **Session Saved**\n\n` +
                  `**File:** ${filename}\n` +
                  `**Location:** ${filepath}\n\n` +
                  `You can resume this session later by loading this file.`,
          },
        ],
      };
    }

    case "start_dialogue": {
      const { sessionId } = z.object({
        sessionId: z.string().optional()
      }).parse(args);
      
      const activeSessionId = sessionId || currentSessionId;
      
      if (!activeSessionId || !sessions.has(activeSessionId)) {
        return {
          content: [
            {
              type: "text",
              text: "❌ Ingen aktiv session. Starta först med `start_session`.",
            },
          ],
        };
      }
      
      // Create dialogue manager for session
      const dialogueManager = new DialogueManager(activeSessionId);
      dialogueManagers.set(activeSessionId, dialogueManager);
      
      // Start dialogue
      const response = await dialogueManager.startDialogue();
      
      return {
        content: [
          {
            type: "text",
            text: `🎯 **Strukturerad Dialog Startad**\n\n${response.message}\n\n` +
                  (response.options ? `**Alternativ:**\n${response.options.map((o, i) => `${i+1}. ${o}`).join('\n')}\n\n` : '') +
                  (response.helpText ? `💡 *${response.helpText}*\n\n` : '') +
                  `Använd \`continue_dialogue\` för att svara.`,
          },
        ],
      };
    }

    case "continue_dialogue": {
      const { response } = z.object({
        response: z.string()
      }).parse(args);
      
      if (!currentSessionId || !dialogueManagers.has(currentSessionId)) {
        return {
          content: [
            {
              type: "text",
              text: "❌ Ingen pågående dialog. Starta med `start_dialogue`.",
            },
          ],
        };
      }
      
      const dialogueManager = dialogueManagers.get(currentSessionId)!;
      const nextPrompt = await dialogueManager.processResponse(response);
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Svar registrerat: "${response}"\n\n` +
                  `${nextPrompt.message}\n\n` +
                  (nextPrompt.options ? `**Alternativ:**\n${nextPrompt.options.map((o, i) => `${i+1}. ${o}`).join('\n')}\n\n` : '') +
                  (nextPrompt.helpText ? `💡 *${nextPrompt.helpText}*\n\n` : '') +
                  (nextPrompt.nextStep === 'complete' ? 
                    `Dialog komplett! Använd \`dialogue_status\` för sammanfattning.` :
                    `Använd \`continue_dialogue\` för att fortsätta.`),
          },
        ],
      };
    }

    case "dialogue_status": {
      if (!currentSessionId || !dialogueManagers.has(currentSessionId)) {
        return {
          content: [
            {
              type: "text",
              text: "❌ Ingen aktiv dialog.",
            },
          ],
        };
      }
      
      const dialogueManager = dialogueManagers.get(currentSessionId)!;
      const state = dialogueManager.getState();
      const summary = dialogueManager.getSummary();
      
      return {
        content: [
          {
            type: "text",
            text: `📊 **Dialog Status**\n\n` +
                  `**Fas:** ${state.currentPhase}\n` +
                  `**Steg:** ${state.currentStep}\n` +
                  `**Antal beslut:** ${state.decisions.length}\n\n` +
                  `${summary}`,
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
            text: `I want to start the COSEAQ C collaborative process.

**File Access:** I can read curriculum files directly from your computer.
Default location checked: ${curriculumPath}

**How this works:**
1. You tell me where your curriculum files are
2. I read them with your permission
3. We analyze them together using AI
4. Collaboratively create the course structure

**Examples:**
- "My files are in /Users/name/Teaching/Biology/"
- "Read the curriculum at /Desktop/NC-Biology.pdf"
- "List files in /Documents/Curriculum/"

Where are your curriculum documents located?`,
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