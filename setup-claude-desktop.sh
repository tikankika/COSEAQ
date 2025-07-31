#!/bin/bash

# Setup script for COSEAQ C MCP in Claude Desktop

echo "🚀 Setting up COSEAQ C MCP for Claude Desktop..."

# First, let's build the MCP server
echo "📦 Building MCP server..."
cd /Users/niklaskarlsson/COSEAQ/mcp-servers/coseaq-c
npm install
npm run build

# Check if Claude config directory exists
CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"

if [ ! -d "$CONFIG_DIR" ]; then
    echo "❌ Claude Desktop config directory not found!"
    echo "Please make sure Claude Desktop is installed."
    exit 1
fi

# Backup existing config if it exists
if [ -f "$CONFIG_FILE" ]; then
    echo "📋 Backing up existing config..."
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup"
fi

# Create or update the config
echo "✏️ Updating Claude Desktop config..."
cat > "$CONFIG_FILE" << 'EOF'
{
  "mcpServers": {
    "coseaq-c": {
      "command": "node",
      "args": ["/Users/niklaskarlsson/COSEAQ/mcp-servers/coseaq-c/dist/index.js"]
    }
  }
}
EOF

echo "✅ Setup complete!"
echo ""
echo "⚠️  IMPORTANT: Please restart Claude Desktop to see the changes!"
echo ""
echo "After restarting, you'll see 'coseaq-c' in your Claude Desktop sidebar."