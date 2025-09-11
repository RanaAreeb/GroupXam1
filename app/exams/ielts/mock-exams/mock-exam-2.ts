"use client";

// IELTS Academic Mock Exam - Intermediate Level
export const mockExam2 = {
  id: 102,
  title: "IELTS Academic Mock Exam - Intermediate Level",
  subject: "Complete IELTS Test",
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
      q: "READING PASSAGE 1: The following passage discusses the benefits of renewable energy. Renewable energy sources such as solar, wind, and hydroelectric power offer numerous advantages over traditional fossil fuels. These clean energy sources help reduce greenhouse gas emissions, create jobs, and provide energy security. Question 1: According to the passage, renewable energy sources help:",
      options: [
        "Increase fossil fuel consumption",
        "Reduce greenhouse gas emissions",
        "Create environmental problems",
        "Decrease energy security"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 2: The passage suggests that renewable energy:",
      options: [
        "Is more expensive than fossil fuels",
        "Creates employment opportunities",
        "Is less reliable than traditional sources",
        "Has no environmental benefits"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 3: Which renewable energy source is NOT mentioned in the passage?",
      options: [
        "Solar power",
        "Wind power",
        "Nuclear power",
        "Hydroelectric power"
      ],
      answer: 2,
      section: "Reading"
    },
    {
      q: "Question 4: The main purpose of this passage is to:",
      options: [
        "Criticize renewable energy",
        "Compare energy costs",
        "Highlight benefits of renewable energy",
        "Discuss energy problems"
      ],
      answer: 2,
      section: "Reading"
    },

    // Listening Section (Questions 5-12)
    {
      q: "LISTENING SECTION 1: You will hear a conversation about university enrollment. Question 5: The student is asking about:",
      options: [
        "Course fees",
        "Enrollment procedures",
        "Library access",
        "Dormitory options"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 6: The enrollment deadline is:",
      options: [
        "End of August",
        "End of September",
        "End of October",
        "End of November"
      ],
      answer: 0,
      section: "Listening"
    },
    {
      q: "Question 7: Students need to submit:",
      options: [
        "Only transcripts",
        "Transcripts and recommendation letters",
        "Only recommendation letters",
        "No additional documents"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 8: The conversation takes place in:",
      options: [
        "A university office",
        "A library",
        "A classroom",
        "A cafeteria"
      ],
      answer: 0,
      section: "Listening"
    },

    // Grammar Section (Questions 9-16)
    {
      q: "Question 9: Choose the correct form: 'The project _____ completed by next Friday.'",
      options: [
        "will be",
        "will being",
        "will have been",
        "will have being"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 10: Select the word closest in meaning to 'comprehensive':",
      options: [
        "brief",
        "thorough",
        "simple",
        "basic"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 11: Complete the sentence: 'If I _____ more time, I would finish the report.'",
      options: [
        "have",
        "had",
        "would have",
        "will have"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 12: Choose the correct preposition: 'The study focuses _____ environmental issues.'",
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
      q: "READING PASSAGE 2: The following passage discusses the impact of technology on education. Modern technology has revolutionized the way students learn and teachers teach. Question 13: According to the passage, technology has:",
      options: [
        "Made education more difficult",
        "Revolutionized learning and teaching",
        "Eliminated the need for teachers",
        "Reduced student engagement"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 14: The passage suggests that modern technology:",
      options: [
        "Only benefits students",
        "Only benefits teachers",
        "Benefits both students and teachers",
        "Has no educational benefits"
      ],
      answer: 2,
      section: "Reading"
    },
    {
      q: "Question 15: The word 'revolutionized' in the passage most likely means:",
      options: [
        "Made worse",
        "Changed completely",
        "Stayed the same",
        "Reduced"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 16: According to the passage, technology in education:",
      options: [
        "Is unnecessary",
        "Enhances the learning experience",
        "Is too expensive",
        "Confuses students"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 17: The main purpose of this passage is to:",
      options: [
        "Criticize technology in education",
        "Discuss the impact of technology on education",
        "Promote specific educational software",
        "Compare traditional and modern teaching"
      ],
      answer: 1,
      section: "Reading"
    },

    // Additional Listening Questions (18-25)
    {
      q: "LISTENING SECTION 2: You will hear a presentation about healthy eating habits. Question 18: The speaker is discussing:",
      options: [
        "Exercise routines",
        "Healthy eating habits",
        "Sleep patterns",
        "Stress management"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 19: According to the speaker, a balanced diet should include:",
      options: [
        "Only fruits and vegetables",
        "Only protein and carbohydrates",
        "Fruits, vegetables, protein, and carbohydrates",
        "Only processed foods"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 20: The speaker recommends drinking:",
      options: [
        "At least 6 glasses of water daily",
        "At least 8 glasses of water daily",
        "At least 10 glasses of water daily",
        "Only when thirsty"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 21: The presentation takes place in:",
      options: [
        "A hospital",
        "A school",
        "A community center",
        "A restaurant"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 22: The speaker mentions that healthy eating:",
      options: [
        "Is too expensive",
        "Improves overall well-being",
        "Is time-consuming",
        "Has no benefits"
      ],
      answer: 1,
      section: "Listening"
    },

    // Additional Grammar Questions (23-30)
    {
      q: "Question 23: Choose the correct form: 'The students _____ their assignments on time.'",
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
      q: "Question 24: Select the appropriate word: 'The _____ of the meeting was productive.'",
      options: [
        "outcome",
        "outcomes",
        "outcoming",
        "outcame"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 25: Complete the sentence: 'The project _____ successfully completed.'",
      options: [
        "was",
        "were",
        "has been",
        "have been"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 26: Choose the correct preposition: 'The report is due _____ next Monday.'",
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
      q: "Question 27: Select the word closest in meaning to 'efficient':",
      options: [
        "slow",
        "effective",
        "difficult",
        "expensive"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 28: Choose the correct form: 'The data _____ analyzed by the research team.'",
      options: [
        "was",
        "were",
        "has been",
        "have been"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 29: Complete the sentence: 'If I _____ more time, I would have finished the project.'",
      options: [
        "have",
        "had",
        "would have",
        "will have"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 30: Select the appropriate word: 'The _____ of the experiment was successful.'",
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
