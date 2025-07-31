# COSEAQ-C: AI-Powered Collaborative Curriculum Analysis

**A theoretically-grounded MCP server for transforming curriculum documents into high-quality course content through genuine teacher-AI collaboration.**

## 🎯 Overview

COSEAQ-C (Content Sequencing for Adaptive Learning - Curriculum) is an MCP (Model Context Protocol) server that scaffolds teachers through the complex process of interpreting curriculum documents and designing pedagogically sound courses. Built on established educational theories, it emphasizes teacher expertise while leveraging AI capabilities for analysis, organization, and creative support.

### What Makes COSEAQ-C Different?

Unlike simple curriculum parsers or content generators, COSEAQ-C:

- **Respects Teacher Expertise**: Teachers make all pedagogical decisions; AI provides analysis and options
- **Captures Context**: Understands local constraints, student needs, and resource limitations  
- **Documents Rationale**: Records the "why" behind decisions for future reference
- **Creates Professional Artifacts**: Generates implementation-ready planning documents
- **Ensures Quality**: Validates alignment, coverage, and feasibility throughout the process

## 📚 Theoretical Foundation

COSEAQ-C is grounded in established educational frameworks:

### Constructive Alignment (Biggs, 1996)
Ensures coherence between:
- **Learning Outcomes**: What students should achieve
- **Teaching Activities**: How students will learn
- **Assessment Tasks**: How learning will be demonstrated

### Backward Design (Wiggins & McTighe, 2005)
Plans courses by:
1. Identifying desired results (from curriculum)
2. Determining acceptable evidence (assessments)
3. Planning learning experiences (activities)

### Cognitive Load Theory (Sweller, 1988)
Manages complexity by:
- Progressive disclosure of information
- Chunking related concepts
- Balancing intrinsic and extraneous load

## 🚀 Key Features

### 1. Collaborative Curriculum Analysis
- **Interpretation Dialogue**: AI helps clarify ambiguous curriculum requirements
- **Multiple Perspectives**: Presents various valid interpretations for teacher choice
- **Context Integration**: Adapts to local conditions and student populations

### 2. Intelligent Course Design
- **Structure Options**: Generates multiple course organizations with rationales
- **Time Optimization**: Calculates realistic time allocations based on constraints
- **Prerequisite Mapping**: Ensures logical knowledge progression

### 3. Professional Artifact Generation
- **Curriculum Analysis Reports**: Document interpretations and decisions
- **Course Outlines**: High-level structure with time allocations
- **Chapter Plans**: Detailed learning sequences with activities
- **Alignment Matrices**: Demonstrate curriculum compliance

### 4. Quality Assurance
- **Coverage Validation**: Ensures all curriculum requirements are met
- **Time Feasibility**: Checks that plans fit available hours
- **Alignment Verification**: Validates outcome-activity-assessment coherence
- **Resource Checking**: Confirms required resources are available

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- Claude Desktop
- Curriculum documents (PDF, Word, or text format)

### Setup

1. Clone and navigate to the repository:
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

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:
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

## 💡 Usage Examples

### Starting a Collaborative Session
```
Teacher: I need help planning my Biology 1 course for gymnasium students.

AI: I'd be happy to help you plan your Biology 1 course. Let's start by understanding your context. Could you tell me:
- What type of school (academic/vocational focus)?
- Approximately how many students?
- What are their typical post-graduation plans?
- What resources do you have available (lab equipment, field trip possibilities, etc.)?
```

### Interpreting Curriculum Requirements
```
Teacher: The curriculum says students should "understand biological systems at different organizational levels." How should I interpret this?

AI: This is indeed broad. Let me help you interpret this for your context. I see three common approaches:

1. **Hierarchical Focus**: Start with molecules → cells → organs → organisms → ecosystems
2. **Systems Thinking**: Emphasize interactions and emergent properties at each level
3. **Applied Understanding**: Focus on levels most relevant to students' future paths

Given that you mentioned many students aim for medicine, which interpretation aligns best with your goals?
```

### Collaborative Course Design
```
AI: Based on our curriculum analysis and your 100 available hours, I've developed three possible course structures:

**Option A: Traditional Sequence**
- Cell Biology (20h) → Genetics (18h) → Evolution (15h) → Ecology (15h) → Human Biology (20h) → Projects (12h)
- Pros: Familiar progression, builds complexity gradually
- Cons: May feel disconnected, ecology comes late

**Option B: Integrated Themes**
- Life's Organization (25h) → Information Flow (25h) → Energy & Matter (25h) → Interactions (25h)
- Pros: Shows connections, modern approach
- Cons: Requires more planning, less traditional

**Option C: Problem-Based**
- Human Health (30h) → Environmental Challenges (30h) → Biotechnology (25h) → Research Skills (15h)
- Pros: Highly engaging, clear relevance
- Cons: May miss some basic concepts, requires strong facilitation

Which resonates with your teaching style and student needs?
```

## 🔧 Available Tools

### Core Tools
- `start_session` - Initialize a collaborative planning session
- `read_curriculum_file` - Access curriculum documents (with permission)
- `analyze_curriculum` - Interpret requirements with AI assistance
- `create_outline` - Design course structure collaboratively
- `review_analysis` - Refine interpretations based on expertise
- `save_session` - Preserve work for future reference

### Coming Soon
- `generate_artifact` - Create professional planning documents
- `validate_quality` - Check alignment and coverage
- `suggest_pedagogy` - Recommend teaching methods
- `export_materials` - Generate implementation-ready resources

## 📊 Quality Indicators

COSEAQ-C continuously monitors quality through:

- **Curriculum Coverage**: 100% of requirements addressed
- **Time Realism**: All activities fit within available hours
- **Learning Progression**: Prerequisites properly sequenced
- **Assessment Validity**: Evaluations match stated objectives
- **Resource Feasibility**: All activities possible with available resources

## 🤝 Contributing

We welcome contributions that enhance teacher-AI collaboration. Priority areas:

1. **Dialogue Enhancement**: More natural, context-aware conversations
2. **Artifact Templates**: Additional professional document formats
3. **Pedagogical Intelligence**: Smarter teaching method suggestions
4. **Quality Validators**: More sophisticated alignment checking
5. **Localization**: Support for different educational systems

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📖 Documentation

- [Theoretical Foundation](./docs/THEORETICAL-FOUNDATION.md) - Educational theories and principles
- [Artifacts Specification](./docs/ARTIFACTS-SPECIFICATION.md) - Document formats and quality criteria
- [API Reference](./docs/API-REFERENCE.md) - Technical tool documentation
- [Examples](./docs/EXAMPLES.md) - Real-world usage scenarios

## 🎓 Research Foundation

COSEAQ-C builds on established educational research:

- Biggs, J. (1996). Enhancing teaching through constructive alignment. *Higher Education*, 32(3), 347-364.
- Wiggins, G., & McTighe, J. (2005). *Understanding by Design*. ASCD.
- Sweller, J. (1988). Cognitive load during problem solving. *Cognitive Science*, 12(2), 257-285.
- Shulman, L. S. (1987). Knowledge and teaching: Foundations of the new reform. *Harvard Educational Review*, 57(1), 1-22.

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

COSEAQ-C was developed through collaboration between educators and AI researchers, with special thanks to the teachers who provided invaluable feedback on the curriculum interpretation process.

---

*"The best technology amplifies human expertise rather than replacing it. COSEAQ-C embodies this principle, creating a true partnership between teachers and AI in the crucial work of curriculum planning."*