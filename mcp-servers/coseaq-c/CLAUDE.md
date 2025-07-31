# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the COSEAQ-C MCP (Model Context Protocol) server - a theoretically-anchored, AI-powered collaborative tool that scaffolds teachers through the complex process of transforming curriculum documents into high-quality, pedagogically sound course content. It emphasizes genuine teacher-AI collaboration, leveraging both teacher expertise and AI capabilities to create content that is contextually relevant, curriculum-aligned, and pedagogically effective.

## 🎯 Quality Vision

### What Makes This MCP High-Quality?

1. **Genuine Collaboration, Not Automation**
   - AI doesn't replace teacher judgment but enhances it
   - Teacher expertise drives all major decisions
   - AI provides analysis, options, and scaffolding
   - Dialogue captures rationale for future reference

2. **Theoretically Grounded**
   - Built on Constructive Alignment (Biggs, 1996)
   - Incorporates cognitive load theory
   - Follows principles of backwards design
   - Respects teacher professional knowledge

3. **Context-Aware and Adaptive**
   - Recognizes local constraints (resources, time, students)
   - Adapts to teacher's pedagogical preferences
   - Considers student backgrounds and goals
   - Supports differentiation from the start

4. **Process-Oriented with Artifacts**
   - Creates tangible, reusable planning documents
   - Tracks decisions and rationale
   - Enables iterative refinement
   - Produces professional-grade outputs

## 📋 Planning Section

### Phase 1: Deep Requirements Analysis

#### Missing Components from Original COSEAQ C
1. **Dialogue Scaffolding**
   - Current: Simple tool calls
   - Needed: Progressive microprompts that guide thinking
   - Solution: Implement conversational state machine

2. **Quality Assurance Process**
   - Current: None
   - Needed: Fact-checking, critical analysis, evaluation protocols
   - Solution: Multi-stage validation workflow

3. **Artifact Generation**
   - Current: Basic session saving
   - Needed: Professional planning documents (see ARTIFACTS-SPECIFICATION.md)
   - Solution: Template-based artifact system

4. **Teacher Expertise Integration**
   - Current: Teacher as input provider
   - Needed: Teacher as collaborative partner
   - Solution: Decision points, rationale capture, option generation

### Phase 2: Architecture Redesign

#### Core Components Needed

1. **Dialogue Manager** (`src/dialogue-manager.ts`)
   ```typescript
   class DialogueManager {
     // Manages conversation flow
     // Implements microprompts
     // Tracks dialogue state
     // Ensures progressive disclosure
   }
   ```

2. **Artifact Generator** (`src/artifact-generator.ts`)
   ```typescript
   class ArtifactGenerator {
     // Creates professional documents
     // Supports multiple formats
     // Includes validation
     // Enables versioning
   }
   ```

3. **Quality Validator** (`src/quality-validator.ts`)
   ```typescript
   class QualityValidator {
     // Checks curriculum coverage
     // Validates time allocations
     // Verifies prerequisites
     // Ensures alignment
   }
   ```

4. **Pedagogical Advisor** (`src/pedagogical-advisor.ts`)
   ```typescript
   class PedagogicalAdvisor {
     // Suggests teaching methods
     // Recommends sequences
     // Proposes assessments
     // Offers differentiation
   }
   ```

### Phase 3: Process Enhancement

#### The Enhanced COSEAQ-C Workflow

1. **Warm Start & Context Building**
   - Understand teacher's context (school, students, resources)
   - Clarify goals and constraints
   - Establish collaboration style preferences

2. **Guided Curriculum Analysis**
   - Not just extraction, but interpretation dialogue
   - "The curriculum says X, how do you interpret this for your students?"
   - Multiple valid interpretations presented
   - Teacher expertise drives final interpretation

3. **Collaborative Structure Design**
   - AI suggests 2-3 structural options
   - Teacher evaluates with guided questions
   - Iterative refinement based on feedback
   - Time allocation negotiation

4. **Content Development Partnership**
   - Teacher identifies key concepts
   - AI suggests connections and sequences
   - Joint development of learning activities
   - Shared creation of assessments

5. **Quality Assurance Dialogue**
   - AI runs validation checks
   - Presents findings as questions, not judgments
   - Teacher makes informed adjustments
   - Document rationale for deviations

6. **Artifact Finalization**
   - Generate professional documents
   - Include teacher's voice and decisions
   - Create implementation-ready materials
   - Enable future iterations

### Phase 4: Implementation Strategy

#### Step 1: Enhance Dialogue System (Priority: HIGH)
- Implement conversation state tracking
- Create microprompt templates
- Add context awareness
- Enable backtracking/revision

#### Step 2: Build Artifact System (Priority: HIGH)
- Create document templates
- Implement generation logic
- Add export capabilities
- Enable versioning

#### Step 3: Add Quality Validators (Priority: MEDIUM)
- Curriculum coverage checker
- Time allocation analyzer
- Prerequisite validator
- Assessment aligner

#### Step 4: Integrate Pedagogical Intelligence (Priority: MEDIUM)
- Teaching method recommender
- Sequence optimizer
- Assessment designer
- Differentiation suggester

### Phase 5: Quality Metrics

#### Success Indicators
1. **Process Quality**
   - Teacher feels heard and respected
   - Decisions are well-documented
   - Rationale is captured
   - Options are presented, not prescribed

2. **Output Quality**
   - 100% curriculum coverage
   - Realistic time allocations
   - Clear learning progressions
   - Valid assessment strategies

3. **Collaboration Quality**
   - Natural dialogue flow
   - Appropriate cognitive load
   - Timely validation
   - Iterative improvement

4. **Artifact Quality**
   - Professional appearance
   - Complete information
   - Clear structure
   - Implementation-ready

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

## 📚 Example High-Quality Dialogues

### Example 1: Curriculum Interpretation
```
AI: "I've found this competency in the curriculum: 'Students should develop 
    understanding of biological systems at different organizational levels.'
    
    This is quite broad. In your teaching context, which organizational 
    levels do you prioritize, and why?"

Teacher: "Given that many of my students aim for medicine, I emphasize 
         cellular and organ system levels more than ecosystem level."

AI: "That makes sense for pre-med preparation. Would you like me to suggest 
    a chapter structure that allocates about 60% to cellular/organ systems, 
    30% to organism level, and 10% to ecosystem connections? 
    We can adjust these proportions."

Teacher: "Let's do 50-35-15 instead. Some students are interested in 
         environmental science."

AI: "Perfect. I'll structure the content with that balance. For the cellular 
    level, should we start with basic cell biology or jump to specialized 
    cells since they have Grade 9 background?"
```

### Example 2: Time Allocation Negotiation
```
AI: "Based on the curriculum's emphasis on practical investigation skills 
    and your available 100 hours, I see three possible time distributions:
    
    Option A: Traditional (60% theory, 25% lab, 15% assessment)
    Option B: Investigation-focused (45% theory, 40% lab, 15% assessment)  
    Option C: Balanced (50% theory, 35% lab, 15% assessment)
    
    Considering your limited lab equipment but strong field study 
    opportunities, which appeals to you?"

Teacher: "Option B, but can we ensure the 'lab' time includes field work?"

AI: "Absolutely! Let's reframe it as 'practical investigation' time. 
    Of that 40 hours, how would you split between indoor labs and field studies?"

Teacher: "About 15 hours traditional lab, 25 hours field studies."

AI: "Excellent. I'll design investigations that leverage your local environment. 
    What field sites do you have access to?"
```

## 🛠️ Enhanced Tool Specifications

### Existing Tools (To Be Enhanced)

1. **`start_session`** → **`start_collaborative_session`**
   - Add context gathering (school type, student demographics, resources)
   - Include teacher preference assessment
   - Establish collaboration style

2. **`analyze_curriculum`** → **`interpret_curriculum_together`**
   - Not just extraction but interpretation dialogue
   - Present multiple valid interpretations
   - Capture teacher's contextual interpretation

3. **`create_outline`** → **`design_structure_collaboratively`**
   - Generate 2-3 structural options
   - Include pros/cons for each
   - Support iterative refinement

### New Tools Needed

4. **`validate_quality`**
   - Check curriculum coverage
   - Analyze time distribution
   - Verify prerequisite flow
   - Assess alignment

5. **`generate_artifact`**
   - Create professional documents
   - Support multiple formats
   - Include teacher decisions
   - Enable export

6. **`suggest_pedagogy`**
   - Recommend teaching methods
   - Propose assessments
   - Offer differentiation strategies
   - Consider resources

7. **`capture_decision`**
   - Document teacher choices
   - Record rationale
   - Track iterations
   - Build knowledge base

## 🔧 Implementation Priorities

### Immediate (Week 1)
1. Enhance dialogue flow in existing tools
2. Add context gathering to session start
3. Implement basic artifact generation
4. Create validation framework

### Short-term (Weeks 2-3)
1. Build full dialogue manager
2. Implement all artifact types
3. Add pedagogical intelligence
4. Create quality validators

### Medium-term (Weeks 4-6)
1. Add advanced features (version control, collaboration)
2. Implement full microprompt system
3. Build teacher preference learning
4. Create comprehensive test suite

## 💡 Key Design Principles

### 1. Teacher Agency
- Teacher makes all major decisions
- AI provides options, not prescriptions
- Rationale is always captured
- Decisions can be revisited

### 2. Progressive Disclosure
- Don't overwhelm with all options at once
- Build understanding step by step
- Allow diving deeper when needed
- Maintain clear progress indicators

### 3. Context Sensitivity
- Remember previous decisions
- Adapt to stated constraints
- Consider local factors
- Respect teacher expertise

### 4. Quality Assurance
- Validate continuously, not just at end
- Present issues as questions
- Suggest solutions, don't mandate
- Document all decisions

## 🚨 Common Pitfalls to Avoid

1. **Over-automation**: Making decisions for the teacher
2. **Information overload**: Presenting too much at once
3. **Rigid process**: Not allowing backtracking/revision
4. **Generic suggestions**: Ignoring context and constraints
5. **Poor documentation**: Not capturing rationale

## 📈 Measuring Success

### Quantitative Metrics
- Curriculum coverage percentage
- Time allocation accuracy
- Prerequisite chain validity
- Assessment alignment score

### Qualitative Indicators
- Teacher satisfaction with process
- Clarity of generated artifacts
- Usefulness of AI suggestions
- Quality of captured rationale

## Changelog

### 2025-07-31 (Comprehensive Quality Enhancement Planning)
- Created detailed scaffolding explanation showing current vs. enhanced implementation
- Defined 5 key components for true teacher-AI collaboration:
  1. Dialogue System with progressive, context-aware scaffolding
  2. Artifact Generation with guided document creation
  3. Quality Validation with continuous, gentle checks
  4. Teacher Partnership through decision documentation
  5. Pedagogical Intelligence with contextual suggestions
- Provided concrete examples of scaffolded dialogue flows
- Illustrated how all components work together in practice
- Emphasized transformation from "tool caller" to "thinking partner"

### 2025-07-31 (Planning Documentation)
- Comprehensive planning for quality improvement
- Defined theoretical foundation integration
- Specified missing components from original COSEAQ C
- Designed enhanced dialogue system architecture
- Planned artifact generation system
- Created quality validation framework
- Outlined pedagogical intelligence integration
- Created IMPLEMENTATION-ROADMAP.md with detailed gap analysis

### 2025-07-31 (Initial Implementation)
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