"use client";

// IELTS Academic Mock Exam - Full Test
export const mockExam1 = {
  id: 101,
  title: "IELTS Academic Mock Exam - Full Test",
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
    // Reading Section (Questions 1-10)
    {
      q: "READING PASSAGE 1: The following passage is about renewable energy sources. Read the passage and answer questions 1-10. Renewable energy sources such as solar, wind, and hydroelectric power are becoming increasingly important in the global energy mix. These sources offer significant advantages over traditional fossil fuels, including reduced greenhouse gas emissions and improved energy security. However, they also present unique challenges that must be addressed for widespread adoption. Question 1: According to the passage, renewable energy sources offer which of the following advantages?",
      options: [
        "Lower initial investment costs",
        "Reduced greenhouse gas emissions",
        "More reliable energy supply",
        "Simpler maintenance requirements"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 2: The passage suggests that renewable energy sources:",
      options: [
        "Are already the primary energy source globally",
        "Present unique challenges for widespread adoption", 
        "Require no government support for development",
        "Have no environmental impact"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 3: Based on the passage, which renewable energy source is NOT mentioned?",
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
        "Criticize renewable energy technologies",
        "Compare different energy sources",
        "Discuss advantages and challenges of renewable energy",
        "Promote specific renewable energy companies"
      ],
      answer: 2,
      section: "Reading"
    },
    {
      q: "Question 5: According to the passage, renewable energy sources contribute to:",
      options: [
        "Increased energy costs",
        "Improved energy security",
        "Higher carbon emissions",
        "Reduced energy efficiency"
      ],
      answer: 1,
      section: "Reading"
    },
    
    // Listening Section (Questions 6-15)
    {
      q: "LISTENING SECTION 1: You will hear a conversation between a student and a university librarian about library services. Question 6: The student is asking about:",
      options: [
        "Book borrowing limits",
        "Library opening hours",
        "Computer access",
        "Study room reservations"
      ],
      answer: 0,
      section: "Listening"
    },
    {
      q: "Question 7: Students can borrow books for a maximum period of:",
      options: [
        "One week",
        "Two weeks", 
        "Three weeks",
        "Four weeks"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 8: The library's late fee is:",
      options: [
        "50 cents per day",
        "1 dollar per day",
        "2 dollars per day", 
        "5 dollars per day"
      ],
      answer: 0,
      section: "Listening"
    },
    {
      q: "Question 9: The librarian mentions that students can access:",
      options: [
        "Only physical books",
        "Online databases and e-books",
        "Only reference materials",
        "Only current periodicals"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 10: The conversation takes place in:",
      options: [
        "A university library",
        "A public library",
        "A school library",
        "A research institute"
      ],
      answer: 0,
      section: "Listening"
    },

    // Grammar & Vocabulary Section (Questions 11-20)
    {
      q: "Question 11: Choose the correct form: 'The research findings _____ published in the journal next month.'",
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
      q: "Question 12: Select the word closest in meaning to 'comprehensive':",
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
      q: "Question 13: Complete the sentence: 'If I _____ more time, I would have completed the project.'",
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
      q: "Question 14: Choose the correct preposition: 'The study focuses _____ the impact of climate change.'",
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
      q: "Question 15: Select the appropriate word: 'The _____ of the research was to investigate new treatment methods.'",
      options: [
        "objective",
        "subjective", 
        "rejective",
        "injective"
      ],
      answer: 0,
      section: "Grammar"
    },

    // Additional Reading Questions (16-25)
    {
      q: "READING PASSAGE 2: The following passage discusses the impact of social media on modern communication. Social media platforms have revolutionized the way people communicate, connect, and share information. While these platforms offer unprecedented opportunities for global connectivity, they also raise concerns about privacy, misinformation, and social isolation. Question 16: According to the passage, social media has:",
      options: [
        "Reduced global connectivity",
        "Revolutionized communication methods",
        "Eliminated privacy concerns",
        "Increased social isolation only"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 17: The passage mentions that social media platforms raise concerns about:",
      options: [
        "Only privacy issues",
        "Privacy, misinformation, and social isolation",
        "Only misinformation",
        "Only social isolation"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 18: The word 'unprecedented' in the passage most likely means:",
      options: [
        "Expected",
        "Never before seen",
        "Common",
        "Outdated"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 19: According to the passage, social media offers:",
      options: [
        "Limited opportunities for connection",
        "Unprecedented opportunities for global connectivity",
        "Only local networking opportunities",
        "No significant benefits"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 20: The tone of the passage can be described as:",
      options: [
        "Completely negative",
        "Completely positive",
        "Balanced and analytical",
        "Highly critical"
      ],
      answer: 2,
      section: "Reading"
    },

    // Additional Listening Questions (21-30)
    {
      q: "LISTENING SECTION 2: You will hear a presentation about university accommodation options. Question 21: The speaker is discussing:",
      options: [
        "University courses",
        "Accommodation options",
        "Student activities",
        "Library services"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 22: According to the speaker, on-campus accommodation:",
      options: [
        "Is more expensive than off-campus",
        "Is cheaper than off-campus",
        "Costs the same as off-campus",
        "Is not available to first-year students"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 23: The application deadline for accommodation is:",
      options: [
        "End of May",
        "End of June",
        "End of July",
        "End of August"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 24: Students can apply for accommodation:",
      options: [
        "Only online",
        "Only in person",
        "Online or by phone",
        "Only by mail"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 25: The speaker mentions that priority is given to:",
      options: [
        "International students only",
        "First-year students",
        "Graduate students",
        "Students with disabilities"
      ],
      answer: 1,
      section: "Listening"
    },

    // Final Grammar Questions (26-30)
    {
      q: "Question 26: Choose the correct form: 'The data _____ analyzed by the research team.'",
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
      q: "Question 27: Select the appropriate word: 'The _____ of the experiment was unexpected.'",
      options: [
        "result",
        "results",
        "resulting",
        "resulted"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 28: Complete the sentence: 'Despite the challenges, the project _____ successfully.'",
      options: [
        "completed",
        "was completed",
        "has completed",
        "will complete"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 29: Choose the correct preposition: 'The study was conducted _____ a period of six months.'",
      options: [
        "during",
        "for",
        "since",
        "until"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 30: Select the word closest in meaning to 'significant':",
      options: [
        "minor",
        "important",
        "small",
        "unimportant"
      ],
      answer: 1,
      section: "Grammar"
    },

    // Additional Reading Questions (31-40)
    {
      q: "READING PASSAGE 3: The following passage discusses the history and development of urban planning. Urban planning has evolved significantly over the centuries, from ancient city designs to modern sustainable development practices. Question 31: According to the passage, urban planning has:",
      options: [
        "Remained unchanged for centuries",
        "Evolved significantly over time",
        "Only developed in modern times",
        "Been abandoned in recent years"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 32: The passage mentions that modern urban planning focuses on:",
      options: [
        "Only aesthetics",
        "Only functionality",
        "Sustainable development practices",
        "Only historical preservation"
      ],
      answer: 2,
      section: "Reading"
    },
    {
      q: "Question 33: The word 'evolved' in the passage most likely means:",
      options: [
        "Stayed the same",
        "Developed gradually",
        "Disappeared",
        "Became worse"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 34: According to the passage, ancient city designs:",
      options: [
        "Are not relevant today",
        "Still influence modern planning",
        "Were completely impractical",
        "Have been forgotten"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 35: The main purpose of this passage is to:",
      options: [
        "Criticize modern urban planning",
        "Compare ancient and modern cities",
        "Discuss the evolution of urban planning",
        "Promote specific planning methods"
      ],
      answer: 2,
      section: "Reading"
    },

    // Additional Listening Questions (36-45)
    {
      q: "LISTENING SECTION 3: You will hear a conversation between two students discussing a research project. Question 36: The students are discussing:",
      options: [
        "A history project",
        "A research project",
        "A literature assignment",
        "A science experiment"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 37: The project deadline is:",
      options: [
        "Next Monday",
        "Next Friday",
        "In two weeks",
        "At the end of the month"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 38: The students need to:",
      options: [
        "Only write a report",
        "Conduct interviews and write a report",
        "Only conduct interviews",
        "Only present findings"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 39: The research topic is about:",
      options: [
        "Environmental issues",
        "Social media impact",
        "Educational methods",
        "Technology trends"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 40: The students plan to:",
      options: [
        "Work individually",
        "Work together as a team",
        "Hire outside help",
        "Postpone the project"
      ],
      answer: 1,
      section: "Listening"
    },

    // Additional Grammar Questions (41-50)
    {
      q: "Question 41: Choose the correct form: 'The research _____ conducted over a period of two years.'",
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
      q: "Question 42: Select the appropriate word: 'The _____ of the study was to examine social trends.'",
      options: [
        "objective",
        "objectives",
        "objecting",
        "objected"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 43: Complete the sentence: 'The results _____ published in a prestigious journal.'",
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
      q: "Question 44: Choose the correct preposition: 'The study was based _____ extensive research.'",
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
      q: "Question 45: Select the word closest in meaning to 'comprehensive':",
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
      q: "Question 46: Choose the correct form: 'The data _____ collected from multiple sources.'",
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
      q: "Question 47: Complete the sentence: 'If the weather _____ better, we would have gone hiking.'",
      options: [
        "was",
        "were",
        "had been",
        "would be"
      ],
      answer: 2,
      section: "Grammar"
    },
    {
      q: "Question 48: Select the appropriate word: 'The _____ of the experiment was unexpected.'",
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
      q: "Question 49: Choose the correct preposition: 'The report focuses _____ environmental sustainability.'",
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
      q: "Question 50: Select the word closest in meaning to 'substantial':",
      options: [
        "small",
        "significant",
        "minor",
        "unimportant"
      ],
      answer: 1,
      section: "Grammar"
    }
  ],
};
