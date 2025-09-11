// Reading practice data organized by categories
import trueFalseData from './true-false-not-given/data.json';
import multipleChoiceData from './multiple-choice/data.json';
import matchingHeadingsData from './matching-headings/data.json';
import sentenceCompletionData from './sentence-completion/data.json';
import summaryCompletionData from './summary-completion/data.json';

export interface ReadingPractice {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  questions: number | any[]; // Can be either number of questions or array of questions
  description: string;
  passage?: string;
  headings?: string[];
  paragraphs?: any[];
  summary?: string;
  blanks?: any[];
}

export const readingPractices: ReadingPractice[] = [
  ...trueFalseData,
  ...multipleChoiceData,
  ...matchingHeadingsData,
  ...sentenceCompletionData,
  ...summaryCompletionData
];

export const readingCategories = [
  "True/False/Not Given",
  "Multiple Choice",
  "Matching Headings",
  "Sentence Completion",
  "Summary Completion",
  "Yes/No/Not Given",
  "Matching Information",
  "Short Answer",
  "Matching Endings"
];

export const getReadingPracticesByCategory = (category: string) => {
  return readingPractices.filter(practice => practice.category === category);
};

export const getReadingPracticesByDifficulty = (difficulty: string) => {
  return readingPractices.filter(practice => practice.difficulty.toLowerCase() === difficulty.toLowerCase());
};