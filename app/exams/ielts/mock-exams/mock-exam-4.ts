"use client";

// IELTS General Training Mock Exam
export const mockExam4 = {
  id: 104,
  title: "IELTS General Training Mock Exam",
  subject: "General Training IELTS",
  duration: "2 hours 45 minutes",
  sections: [
    {
      name: "Reading",
      duration: "60 minutes",
      questions: 40
    },
    {
      name: "Listening", 
      duration: "30 minutes",
      questions: 40
    },
    {
      name: "Writing",
      duration: "60 minutes", 
      questions: 2
    },
    {
      name: "Speaking",
      duration: "11-14 minutes",
      questions: 3
    }
  ],
  questions: [
    // Reading Section (Questions 1-8)
    {
      q: "READING PASSAGE 1: The following passage is about workplace communication. Effective communication in the workplace is essential for productivity and team cohesion. This passage discusses various communication strategies and their benefits. Question 1: According to the passage, effective communication is important for:",
      options: [
        "Only productivity",
        "Only team cohesion",
        "Productivity and team cohesion",
        "Only management"
      ],
      answer: 2,
      section: "Reading"
    },
    {
      q: "Question 2: The passage suggests that communication strategies:",
      options: [
        "Are not important",
        "Have various benefits",
        "Are too complex",
        "Don't work"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 3: The main purpose of this passage is to:",
      options: [
        "Criticize workplace communication",
        "Discuss communication strategies",
        "Promote specific companies",
        "Compare different workplaces"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 4: According to the passage, good communication leads to:",
      options: [
        "More problems",
        "Better productivity",
        "Less teamwork",
        "Confusion"
      ],
      answer: 1,
      section: "Reading"
    },

    // Listening Section (Questions 5-12)
    {
      q: "LISTENING SECTION 1: You will hear a conversation about job applications. Question 5: The speaker is discussing:",
      options: [
        "Job interviews",
        "Job applications",
        "Salary negotiations",
        "Work benefits"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 6: The application deadline is:",
      options: [
        "Next week",
        "Next month",
        "In two weeks",
        "Tomorrow"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 7: Applicants need to include:",
      options: [
        "Only a resume",
        "Resume and cover letter",
        "Only a cover letter",
        "No documents"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 8: The conversation takes place in:",
      options: [
        "An office",
        "A restaurant",
        "A library",
        "A school"
      ],
      answer: 0,
      section: "Listening"
    },

    // Grammar Section (Questions 9-16)
    {
      q: "Question 9: Choose the correct form: 'The meeting _____ scheduled for tomorrow.'",
      options: [
        "is",
        "are",
        "was",
        "were"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 10: Select the appropriate word: 'The _____ of the presentation was clear.'",
      options: [
        "message",
        "messages",
        "messaging",
        "messaged"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 11: Complete the sentence: 'The team _____ the project on time.'",
      options: [
        "completed",
        "was completed",
        "has completed",
        "will complete"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 12: Choose the correct preposition: 'The report is due _____ Friday.'",
      options: [
        "in",
        "on",
        "at",
        "for"
      ],
      answer: 1,
      section: "Grammar"
    },

    // Additional Reading Questions (13-20)
    {
      q: "READING PASSAGE 2: The following passage discusses the importance of time management in professional settings. Effective time management skills are crucial for career success and personal well-being. Question 13: According to the passage, time management skills are:",
      options: [
        "Not important for career success",
        "Crucial for career success and personal well-being",
        "Only important for personal life",
        "Only relevant for managers"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 14: The passage suggests that effective time management:",
      options: [
        "Only benefits the individual",
        "Benefits both career and personal life",
        "Is too difficult to learn",
        "Has no real benefits"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 15: The word 'crucial' in the passage most likely means:",
      options: [
        "Optional",
        "Essential",
        "Unimportant",
        "Difficult"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 16: According to the passage, time management affects:",
      options: [
        "Only work performance",
        "Only personal relationships",
        "Both professional and personal aspects",
        "Only financial success"
      ],
      answer: 2,
      section: "Reading"
    },
    {
      q: "Question 17: The main purpose of this passage is to:",
      options: [
        "Criticize poor time management",
        "Explain the importance of time management",
        "Promote specific time management tools",
        "Compare different time management methods"
      ],
      answer: 1,
      section: "Reading"
    },

    // Additional Listening Questions (18-25)
    {
      q: "LISTENING SECTION 2: You will hear a presentation about workplace safety. Question 18: The speaker is discussing:",
      options: [
        "Employee benefits",
        "Workplace safety",
        "Company policies",
        "Training programs"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 19: According to the speaker, workplace safety requires:",
      options: [
        "Only management attention",
        "Only employee cooperation",
        "Both management and employee participation",
        "Only government regulations"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 20: The speaker mentions that safety training should be:",
      options: [
        "Optional for employees",
        "Mandatory for all employees",
        "Only for new employees",
        "Only for management"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 21: The presentation takes place in:",
      options: [
        "A factory",
        "An office building",
        "A training center",
        "A government office"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 22: The speaker concludes that workplace safety:",
      options: [
        "Is not important",
        "Is everyone's responsibility",
        "Is only the employer's concern",
        "Is too expensive to implement"
      ],
      answer: 1,
      section: "Listening"
    },

    // Additional Grammar Questions (23-30)
    {
      q: "Question 23: Choose the correct form: 'The employees _____ their safety training yesterday.'",
      options: [
        "completed",
        "was completed",
        "has completed",
        "will complete"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 24: Select the appropriate word: 'The _____ of the safety program was successful.'",
      options: [
        "implementation",
        "implementations",
        "implementing",
        "implemented"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 25: Complete the sentence: 'The safety procedures _____ updated regularly.'",
      options: [
        "is",
        "are",
        "was",
        "were"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 26: Choose the correct preposition: 'The training session is scheduled _____ next Monday.'",
      options: [
        "in",
        "on",
        "at",
        "for"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 27: Select the word closest in meaning to 'mandatory':",
      options: [
        "optional",
        "required",
        "suggested",
        "recommended"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 28: Choose the correct form: 'The safety equipment _____ inspected monthly.'",
      options: [
        "is",
        "are",
        "was",
        "were"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 29: Complete the sentence: 'If the safety protocols _____ followed, accidents can be prevented.'",
      options: [
        "is",
        "are",
        "was",
        "were"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 30: Select the appropriate word: 'The _____ of the safety audit was positive.'",
      options: [
        "result",
        "results",
        "resulting",
        "resulted"
      ],
      answer: 0,
      section: "Grammar"
    }
  ],
};
