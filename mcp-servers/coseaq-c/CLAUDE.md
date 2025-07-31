# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the COSEAQ-C MCP (Model Context Protocol) server - an AI-powered tool for collaborative curriculum analysis and course content generation. It helps teachers transform curriculum documents into structured course content through an interactive dialogue with AI.

## Key Commands

### Development
```bash
npm run build       # Compile TypeScript to JavaScript (required after changes)
npm run dev         # Development mode with hot reload (uses tsx)
npm start          # Run the compiled server
```

### Testing in Claude Desktop
After making changes:
1. Run `npm run build`
2. Restart Claude Desktop completely
3. Check that "coseaq-c" appears in MCP servers list
4. Use `@coseaq-c` to interact with the server

## Architecture

### Core Components

1. **`src/index.ts`** - Main MCP server
   - Implements 8 tools for curriculum analysis
   - Handles file permissions and session management
   - Entry point for all MCP requests

2. **`src/coseaq-session.ts`** - Session state management
   - `CoseaqSession` class tracks collaborative work
   - Models: `CurriculumAnalysis`, `CourseOutline`, `ChapterOutline`
   - Enables save/resume functionality

3. **`src/curriculum-analyzer.ts`** - AI analysis preparation
   - `prepareAnalysisPrompts()` - Creates prompts for AI analysis
   - `createBasicAnalysis()` - Initial analysis structure
   - Pattern-based fallback for non-AI scenarios

4. **`src/ai-prompts.ts`** - AI prompt templates
   - `ANALYSIS_PROMPTS` - Extract competencies, objectives, topics
   - `DIALOGUE_PROMPTS` - Teacher-AI collaboration prompts
   - Template formatting utilities

### Data Flow
```
Teacher Input → MCP Tool → Session State → AI Analysis → Teacher Review → Refined Output
```

### Available MCP Tools
- `start_session` - Initialize collaborative session
- `read_curriculum_file` - Read PDF/Word/text files (with permission)
- `list_curriculum_files` - Browse directories
- `analyze_curriculum` - Trigger AI analysis
- `review_analysis` - Apply teacher feedback
- `create_outline` - Generate course structure
- `save_session` - Persist work

## File Format Support

- **PDF**: Uses `pdfjs-dist/legacy/build/pdf.mjs` (Node.js compatible build)
- **Word**: Uses `mammoth` for .docx/.doc extraction
- **Text/Markdown**: Direct file system reading

## Important Patterns

### Permission System
Files are accessed only with user permission. The system:
1. Requests permission via console log
2. Stores permission in `filePermissions` Map
3. Currently auto-approves (production would prompt user)

### Session Management
Sessions track the entire collaborative process:
```typescript
session.recordAction(actionType, data)  // Track all changes
session.getProgress()                   // Show completion status
session.toJSON() / fromJSON()          // Enable save/load
```

### AI Integration
The system prepares prompts for Claude to analyze curricula:
1. Documents are formatted into structured prompts
2. AI analyzes using templates from `ai-prompts.ts`
3. Results are stored in session for refinement
4. Teacher feedback modifies the analysis

## Project Dependencies

### Core Dependencies
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `pdfjs-dist` - PDF parsing (use legacy build for Node.js)
- `mammoth` - Word document extraction
- `uuid` - Session ID generation
- `zod` - Schema validation

### Development Dependencies
- `typescript` - Type safety
- `tsx` - Hot reload development
- `@types/*` - TypeScript definitions

## Common Issues & Solutions

### PDF Reading Errors
- Uses legacy pdfjs build to avoid DOM dependencies
- If PDF fails, check file permissions and path

### MCP Not Showing in Claude Desktop
1. Ensure `npm run build` was run
2. Check file is executable: `chmod +x dist/index.js`
3. Verify config path: `~/Library/Application Support/Claude/claude_desktop_config.json`
4. Kill all Claude processes: `killall Claude`

### TypeScript Compilation
- Target: ES2022 with ESNext modules
- Strict mode enabled
- Import `.js` extensions required for ESM

### Claude Desktop Configuration
Location: `~/Library/Application Support/Claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "coseaq-c": {
      "command": "/opt/homebrew/bin/node",
      "args": ["/Users/niklaskarlsson/COSEAQ/mcp-servers/coseaq-c/dist/index.js"],
      "env": { "NODE_NO_WARNINGS": "1" }
    }
  }
}
```

## COSEAQ-C Methodology

The server implements a collaborative process:
1. **START** - Teacher identifies curriculum files
2. **Analyze** - AI extracts key information
3. **Review** - Teacher provides feedback
4. **Refine** - AI adjusts based on input
5. **Create** - Generate course structure together
6. **Save** - Persist session for later

This iterative approach combines AI efficiency with teacher expertise to create pedagogically sound course content aligned with curriculum requirements.

## Changelog

### 2025-07-31
- Initial MCP server implementation for COSEAQ-C methodology
- Created TypeScript/Node.js project structure with ESM modules
- Implemented file access permission system for secure document reading
- Added PDF parsing support (migrated from pdf-parse to pdfjs-dist for compatibility)
- Added Word document support using mammoth
- Implemented session management system (`CoseaqSession` class) for multi-step workflows
- Created AI-powered curriculum analyzer with prompt templates
- Added 8 MCP tools: start_session, read_curriculum_file, list_curriculum_files, analyze_curriculum, review_analysis, create_outline, save_session, set_default_curriculum_path
- Fixed Claude Desktop integration issues (shebang, node path, permissions)
- Created comprehensive documentation (README.md, AI-INTEGRATION.md, COLLABORATION-FLOW.md)
- Redesigned from "upload" model to direct file access from user's computer
- Implemented collaborative teacher-AI workflow following COSEAQ-C methodology