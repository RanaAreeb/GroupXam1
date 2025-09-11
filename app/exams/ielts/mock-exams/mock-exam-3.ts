"use client";

// IELTS Academic Mock Exam - Advanced Level
export const mockExam3 = {
  id: 103,
  title: "IELTS Academic Mock Exam - Advanced Level",
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
      q: "READING PASSAGE 1: The following passage examines the impact of artificial intelligence on modern society. AI technologies are transforming industries, from healthcare to finance, while raising important questions about ethics, privacy, and employment. Question 1: According to the passage, AI is transforming:",
      options: [
        "Only healthcare",
        "Only finance",
        "Multiple industries",
        "Only technology"
      ],
      answer: 2,
      section: "Reading"
    },
    {
      q: "Question 2: The passage mentions that AI raises questions about:",
      options: [
        "Only ethics",
        "Only privacy",
        "Ethics, privacy, and employment",
        "Only employment"
      ],
      answer: 2,
      section: "Reading"
    },
    {
      q: "Question 3: The word 'transforming' in the passage most likely means:",
      options: [
        "Destroying",
        "Changing significantly",
        "Maintaining",
        "Reducing"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 4: According to the passage, AI technologies:",
      options: [
        "Have no impact on society",
        "Are only beneficial",
        "Present both opportunities and challenges",
        "Are completely harmful"
      ],
      answer: 2,
      section: "Reading"
    },
    {
      q: "Question 5: The tone of the passage can be described as:",
      options: [
        "Completely negative",
        "Completely positive",
        "Balanced and analytical",
        "Highly critical"
      ],
      answer: 2,
      section: "Reading"
    },

    // Listening Section (Questions 6-15)
    {
      q: "LISTENING SECTION 1: You will hear a lecture about climate change research. Question 6: The speaker is discussing:",
      options: [
        "Weather patterns",
        "Climate change research",
        "Environmental policies",
        "Renewable energy"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 7: According to the speaker, global temperatures have risen by:",
      options: [
        "0.5°C",
        "1.0°C",
        "1.5°C",
        "2.0°C"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 8: The speaker mentions that climate change affects:",
      options: [
        "Only polar regions",
        "Only coastal areas",
        "Global weather patterns",
        "Only tropical regions"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 9: The research methodology includes:",
      options: [
        "Only computer models",
        "Only satellite data",
        "Computer models and satellite data",
        "Only ground observations"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 10: The speaker concludes that:",
      options: [
        "Climate change is not real",
        "More research is needed",
        "The problem is solved",
        "No action is required"
      ],
      answer: 1,
      section: "Listening"
    },

    // Grammar Section (Questions 11-20)
    {
      q: "Question 11: Choose the correct form: 'The data _____ analyzed by the research team.'",
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
      q: "Question 12: Select the appropriate word: 'The _____ of the experiment was unexpected.'",
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
      q: "Question 13: Complete the sentence: 'Despite the challenges, the project _____ successfully.'",
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
      q: "Question 14: Choose the correct preposition: 'The study was conducted _____ a period of six months.'",
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
      q: "Question 15: Select the word closest in meaning to 'significant':",
      options: [
        "minor",
        "important",
        "small",
        "unimportant"
      ],
      answer: 1,
      section: "Grammar"
    },

    // Additional Reading Questions (16-25)
    {
      q: "READING PASSAGE 2: The following passage discusses the evolution of human communication. From cave paintings to digital media, human communication has undergone remarkable transformations throughout history. Question 16: According to the passage, human communication has:",
      options: [
        "Remained unchanged throughout history",
        "Undergone remarkable transformations",
        "Only evolved in recent years",
        "Become less effective over time"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 17: The passage mentions that communication evolution includes:",
      options: [
        "Only digital media",
        "Only cave paintings",
        "From cave paintings to digital media",
        "Only written language"
      ],
      answer: 2,
      section: "Reading"
    },
    {
      q: "Question 18: The word 'remarkable' in the passage most likely means:",
      options: [
        "Ordinary",
        "Extraordinary",
        "Unusual",
        "Common"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 19: According to the passage, communication transformations:",
      options: [
        "Have no impact on society",
        "Reflect societal changes",
        "Are purely technological",
        "Happen randomly"
      ],
      answer: 1,
      section: "Reading"
    },
    {
      q: "Question 20: The main purpose of this passage is to:",
      options: [
        "Criticize modern communication",
        "Discuss the evolution of human communication",
        "Promote specific communication tools",
        "Compare ancient and modern methods"
      ],
      answer: 1,
      section: "Reading"
    },

    // Additional Listening Questions (21-30)
    {
      q: "LISTENING SECTION 2: You will hear a presentation about sustainable development. Question 21: The speaker is discussing:",
      options: [
        "Economic growth",
        "Sustainable development",
        "Environmental destruction",
        "Industrial progress"
      ],
      answer: 1,
      section: "Listening"
    },
    {
      q: "Question 22: According to the speaker, sustainable development requires:",
      options: [
        "Only economic considerations",
        "Only environmental considerations",
        "Balancing economic, social, and environmental factors",
        "Only social considerations"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 23: The speaker mentions that sustainability involves:",
      options: [
        "Short-term planning only",
        "Long-term planning only",
        "Both short-term and long-term planning",
        "No planning at all"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 24: The presentation takes place in:",
      options: [
        "A university",
        "A government office",
        "A conference center",
        "A research institute"
      ],
      answer: 2,
      section: "Listening"
    },
    {
      q: "Question 25: The speaker concludes that sustainable development:",
      options: [
        "Is impossible to achieve",
        "Requires global cooperation",
        "Is only a theoretical concept",
        "Has no practical benefits"
      ],
      answer: 1,
      section: "Listening"
    },

    // Additional Grammar Questions (26-35)
    {
      q: "Question 26: Choose the correct form: 'The research findings _____ published in multiple journals.'",
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
      q: "Question 27: Select the appropriate word: 'The _____ of the study was comprehensive.'",
      options: [
        "methodology",
        "methodologies",
        "methodological",
        "methodologically"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 28: Complete the sentence: 'The experiment _____ conducted under controlled conditions.'",
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
      q: "Question 29: Choose the correct preposition: 'The research was based _____ extensive data analysis.'",
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
      q: "Question 30: Select the word closest in meaning to 'comprehensive':",
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
      q: "Question 31: Choose the correct form: 'The data _____ collected from various sources.'",
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
      q: "Question 32: Complete the sentence: 'If the conditions _____ different, the results would vary.'",
      options: [
        "was",
        "were",
        "had been",
        "would be"
      ],
      answer: 1,
      section: "Grammar"
    },
    {
      q: "Question 33: Select the appropriate word: 'The _____ of the research was groundbreaking.'",
      options: [
        "discovery",
        "discoveries",
        "discovering",
        "discovered"
      ],
      answer: 0,
      section: "Grammar"
    },
    {
      q: "Question 34: Choose the correct preposition: 'The study focuses _____ advanced techniques.'",
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
      q: "Question 35: Select the word closest in meaning to 'groundbreaking':",
      options: [
        "ordinary",
        "revolutionary",
        "common",
        "traditional"
      ],
      answer: 1,
      section: "Grammar"
    }
  ],
};
