// Grammar & Vocabulary practice data organized by categories
import tensesData from './tenses/data.json';
import conditionalsData from './conditionals/data.json';
import passiveVoiceData from './passive-voice/data.json';

export interface GrammarPractice {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  questions: number | any[];
  description: string;
  grammarPoint?: string;
  vocabulary?: string[];
}

export const grammarPractices: GrammarPractice[] = [
  ...tensesData,
  ...conditionalsData,
  ...passiveVoiceData
];

export const grammarCategories = [
  "Tenses",
  "Conditionals",
  "Passive Voice",
  "Reported Speech",
  "Articles",
  "Prepositions",
  "Academic Vocabulary",
  "Synonyms & Paraphrasing",
  "Collocations",
  "Word Formation"
];

export const getGrammarPracticesByCategory = (category: string) => {
  return grammarPractices.filter(practice => practice.category === category);
};

export const getGrammarPracticesByDifficulty = (difficulty: string) => {
  return grammarPractices.filter(practice => practice.difficulty.toLowerCase() === difficulty.toLowerCase());
};