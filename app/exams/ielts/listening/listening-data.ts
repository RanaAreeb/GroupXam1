// Listening practice data organized by categories
import multipleChoiceData from './multiple-choice/data.json';
import formCompletionData from './form-completion/data.json';
import noteCompletionData from './note-completion/data.json';

export interface ListeningPractice {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  questions: number | any[];
  description: string;
  audioUrl?: string;
  transcript?: string;
}

export const listeningPractices: ListeningPractice[] = [
  ...multipleChoiceData,
  ...formCompletionData,
  ...noteCompletionData
];

export const listeningCategories = [
  "Multiple Choice",
  "Form Completion",
  "Note Completion",
  "Table Completion",
  "Sentence Completion",
  "Short Answer",
  "Map/Plan Labelling"
];

export const getListeningPracticesByCategory = (category: string) => {
  return listeningPractices.filter(practice => practice.category === category);
};

export const getListeningPracticesByDifficulty = (difficulty: string) => {
  return listeningPractices.filter(practice => practice.difficulty.toLowerCase() === difficulty.toLowerCase());
};
