# COSEAQ C MCP Server

MCP (Model Context Protocol) server for COSEAQ C - Content Generation from Syllabus and National Curriculum.

## Features

- 📄 **Read curriculum files** - PDF, Word documents, and text files
- 🔐 **Permission-based access** - Asks before accessing files
- 📁 **File browsing** - List and explore curriculum directories
- 🔍 **Curriculum analysis** - Analyze syllabus and national curriculum
- 📝 **Content generation** - Generate course outlines and chapters

## Installation

1. Clone the repository and navigate to the MCP server:
```bash
cd /Users/niklaskarlsson/COSEAQ/mcp-servers/coseaq-c
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

4. Configure Claude Desktop:

Edit your Claude Desktop configuration file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

Add the COSEAQ C server:
```json
{
  "mcpServers": {
    "coseaq-c": {
      "command": "node",
      "args": ["/Users/niklaskarlsson/COSEAQ/mcp-servers/coseaq-c/dist/index.js"],
      "env": {}
    }
  }
}
```

5. Restart Claude Desktop

## Usage

In Claude Desktop, you can:

1. **Start the process:**
   ```
   Use the COSEAQ C server to help me generate course content
   ```

2. **Read curriculum files:**
   ```
   Read the biology syllabus from /path/to/syllabus.pdf
   ```

3. **List files:**
   ```
   Show me all PDF files in my curriculum folder
   ```

4. **Analyze curriculum:**
   ```
   Analyze this syllabus according to COSEAQ C methodology
   ```

## Available Tools

- `read_curriculum_file` - Read PDF, Word, or text files (with permission)
- `list_curriculum_files` - Browse directories
- `set_default_curriculum_path` - Set default curriculum folder
- `analyze_curriculum` - Analyze curriculum documents

## File Permissions

The server will ask for permission before accessing files. This ensures your privacy and security.

## Supported File Types

- PDF (`.pdf`)
- Word documents (`.docx`, `.doc`)
- Text files (`.txt`)
- Markdown (`.md`)

## Development

To run in development mode:
```bash
npm run dev
```

## License

MIT