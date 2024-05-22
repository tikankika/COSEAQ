# COSEAQ framework - Introduction

The COSEAQ framework, designed for use with generative AI, goes beyond merely facilitating educators' work with content creation. The framework, aiming to improve the development of high-quality content such as essay questions, assessment guidelines, and quizzes, engages in dialogue with AI while considering theoretical aspects like constructive alignment and assessment literacy in the creation of educational materials. It is designed to enhance and deepen workflows, ensuring alignment with actual teaching, the syllabus, and the national curriculum.

The framework builds upon the concept of microprompts to scaffold the content creation process and facilitate meaningful dialogues between teachers and AI. It is incorporated in a serie of CustomGPTs (OpenAI, GPT-4). Although these CustomGPTs can function independently, they are specifically designed to be combined, enhancing their effectiveness. Additionally, the framework can be advantageously used as separate series of microprompts in other language models, such as Claude 3 and Gemini Advanced.

**Core Aspects of the Framework:**
<ul>
      <li>**Dialogic Approach:** Facilitates meaningful exchanges between educators and AI, enhancing the creation process through active dialogue.</li>
      <li>**Scaffolding Support:** Microprompts provide structure and guidance to align the generated content with educational standards.</li>
      <li>**Customized GPTs:** Each GPT is designed to stand alone, yet they can be combined to cover various educational needs, ensuring versatility and adaptability.</li>
</ul>

**Purpose Beyond Efficiency:**
The framework is not merely about simplifying and streamlining teachers' work; it's about enhancing our professional expertise and practice. By integrating generative AI into the creation of educational materials, the aim is to support and enhance pedagogical processes without compromising educational integrity or teacher autonomy. Reflecting a combination of theoretical frameworks, it offers educators the flexibility to select approaches that best fit their teaching practice and subject matter, ensuring that the technology serves the teacher and not the other way around.


## Components overveiw
 
There are different Phases that have specific functions. Each Phase have specific commands that are structured set of "micro-prompts" and you move on to next by **"Commands"** 
<ul>
  <li>COSEAQ Phase 1 - Develop Distractors and Alignment: Focus on creating plausible distractors and ensuring alignment with learning objectives.</li>
  <li>COSEAQ Phase 2 - Develop Study Questions: Develop questions aimed at assessing comprehension and application of knowledge for study purposes.</li>
  <li>COSEAQ Phase 3 - ESSAY AND TEST QUESTIONS: Formulate Assessment Instructions: Design detailed instructions for assessments to guide both educators and students.</li>
  <li>COSEAQ Phase 4 - QUIZ Questions Generation: Generate quiz questions that thoroughly test understanding of specific concepts, including creating distractors and providing feedback.</li>
  <li>COSEAQ Phase 5 - QUIZ Questions Evaluation (Beta): A beta phase focused on rigorously evaluating the generated quiz questions for plausibility, balance, and educational value.</li>
</ul>

### Micropromts for each GPT



**Start with **Phase 1** and change between the different Phases:**   
<br>![image](https://github.com/tikankika/Generate-Questions-for-Essay-and-Quiz---Theoretical-approach/assets/163601082/365b9a7a-5959-4964-bf6a-bf83a27db62a) </br>


![image](https://github.com/tikankika/Generate-Questions-for-Essay-and-Quiz---Theoretical-approach/assets/163601082/7188e394-fa1f-4434-b2f4-17f5bb1af62a)


## Brief information / Quickstart!

### **Phase 1** 
Focuses on analyzing the concept i textbooks to pinpointing misconceptions, and aligning with the curriculum to establish clear assessment goals. The focus is on Misconception Identification, alongside ensuring Curriculum Alignment.
<br> **Upload:** Textbook, curriculum and choose one or a few concepts... <br/> 
#### Commands: 
      1. READ 
    	2. BREAKDOWN 
      3. Concept_Analysis
       
  

 
### Phase 2 
Design Study questions on a specific concept, ensuring depth and clarity. Include plausible distractors, grading levels, and comprehensive feedback. Step 1 to create QUIZ & ESSAY questions. See GitHub
    
      (DEVISE_QUESTIONS: to create questions assessing comprehension and understanding of specific concepts, including semantic intricacies.)
      1. DEVELOP_DISTRACTORS:  to generate plausible distractors based on common misunderstandings, aiming to challenge students to accurately differentiate between closely related concepts.
      3. FEEDBACK_FOR_QUESTIONS:  to provide detailed explanations for the correct answers, clarifying the reasoning behind each distractor's plausibility and addressing misconceptions.
      (FORMULATE_QUESTIONS:  to devise additional questions that deepen engagement with the subject matter, promoting critical thinking and application of knowledge.)
      2. STUDY_QUESTIONS:  to generate a set of study questions intended for revision and deeper understanding of the subject matter, exploring different aspects of the concept or area being studied.
      4. PRINT_QUESTIONS:  to compile and print all developed questions, including quiz questions, study questions, distractors, and feedback, offering a comprehensive study and revision tool.
    


### Phase 3 *BETA!*
Create and refine questions on subject concepts, seeking teacher feedback. Develop assessment guidelines, balance question complexity with points, and generate examples to illustrate grading criteria. Sequentially tackle tasks, from question creation to grading facilitation.
#### Commands:
        STEPS_FOR_GENERATION:  to initiate the process of generating detailed assessment guidelines, including the review of policy documents, consideration of maximum points, and the balance between question complexity and points allocated.
        RESPONSE_EXAMPLES: to develop examples of student responses that illustrate different levels of understanding and meet the assessment criteria for grades E, C, and A.        
        ASSESSMENT_TABLE:  to design a table detailing each task with criteria for scoring and points allocation, facilitating assessment and grading.

### Phase 4
Generate quiz questions with analytical depth, including plausible distractors and detailed feedback, focusing on a specific concept. Structure questions across difficulty levels E, C, and A, directly engaging with educational material for comprehensive assessment.


#### Commands:
      QUIZ_QUESTIONS: for the entire quiz question generation process, including opening the code environment, picking concepts, and creating a question table.
      DEVISE_QUESTIONS: To develop questions with depth, based on educational standards and textbook content.
      DEVELOP_DISTRACTORS: To create plausible distractors based on common misunderstandings related to the quiz questions.
      FEEDBACK_FOR_QUESTIONS: To provide explanations for the correct answers and detail why distractors are incorrect, aimed at enhancing understanding.
    

### Phase 5 *BETA!*
Evaluate quiz questions through a comprehensive analysis framework focusing on plausibility of distractors, question uniqueness, answer option balance, and distractor variation to ensure educational value and effective knowledge application testing.
#### Commands:

      Duplicates:  to identify duplicate questions.
      Balance:  to ensure answer options are balanced and no option stands out.
      Similarities:  to find questions with high content or structural similarity.
      Plausibility:  to assess the plausibility of incorrect answers.
      Distractors:  to analyze the variety among distractors for each question.
      Report_Findings:  to compile findings and recommendations for improving quiz questions.


# Theoretical approch 

## Comming
