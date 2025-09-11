"use client";

// Lightweight IELTS practice sets to match WAEC/WASSCE/JAMB structure
// Each question uses options: string[] and answer: number (index)

export const ieltsExams = [
  {
    id: 1,
    title: "IELTS Reading - Practice Set",
    subject: "Reading",
    questions: [
      {
        q: "The passage suggests that the primary benefit of peer review is:",
        options: [
          "ensuring authors receive higher salaries",
          "improving the reliability and quality of research",
          "speeding up publication timelines",
          "eliminating the need for editors"
        ],
        answer: 1,
      },
      {
        q: "According to the text, a 'meta-analysis' is best described as:",
        options: [
          "a critique written by an editor",
          "a study that combines results from multiple papers",
          "a personal reflection by the researcher",
          "an interview with subject matter experts"
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 2,
    title: "IELTS Listening - Practice Set",
    subject: "Listening",
    questions: [
      {
        q: "The speaker's main purpose is to:",
        options: [
          "advertise a new product",
          "explain library borrowing rules",
          "announce road closures",
          "describe a museum exhibition"
        ],
        answer: 1,
      },
      {
        q: "Students can borrow a maximum of:",
        options: ["two books for two weeks", "three books for one week", "five books for two weeks", "ten books for one week"],
        answer: 2,
      },
    ],
  },
  {
    id: 3,
    title: "IELTS Grammar & Vocabulary - Practice Set",
    subject: "Grammar & Vocabulary",
    questions: [
      {
        q: "Choose the correct option: 'The report must _____ by Friday.'",
        options: ["be submit", "submitted", "be submitted", "submitting"],
        answer: 2,
      },
      {
        q: "Select the word closest in meaning to 'alleviate':",
        options: ["worsen", "reduce", "ignore", "cause"],
        answer: 1,
      },
    ],
  },
];

// Import mock exams from separate files
import { mockExam, allMockExams } from './mock-exams';

// Export mock exams from the new structure
export { mockExam, allMockExams };

