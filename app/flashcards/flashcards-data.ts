import physicsFlashcards from "./data/physics-flashcards.json";
import chemistryFlashcards from "./data/chemistry-flashcards.json";
import biologyFlashcards from "./data/biology-flashcards.json";
import mathematicsFlashcards from "./data/mathematics-flashcards.json";
import englishFlashcards from "./data/english-flashcards.json";

export interface Flashcard {
  front: string;
  back: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  cardCount: number;
  difficulty: string;
  cards: Flashcard[];
}

export interface FlashcardData {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  sets: FlashcardSet[];
}

const flashcardData: Record<string, FlashcardData> = {
  physics: physicsFlashcards as FlashcardData,
  chemistry: chemistryFlashcards as FlashcardData,
  biology: biologyFlashcards as FlashcardData,
  mathematics: mathematicsFlashcards as FlashcardData,
  english: englishFlashcards as FlashcardData,
};

export function getFlashcardData(subject: string): FlashcardData | null {
  const subjectKey = subject.toLowerCase();
  return flashcardData[subjectKey] || null;
}

export function getAllFlashcardSubjects(): string[] {
  return Object.keys(flashcardData);
}

export function getFlashcardSets(subject: string): FlashcardSet[] {
  const data = getFlashcardData(subject);
  if (!data) return [];

  // Calculate the correct card count for each set
  return data.sets.map((set) => ({
    ...set,
    cardCount: set.cards ? set.cards.length : 0,
  }));
}

export function getFlashcardSet(
  subject: string,
  setId: string
): FlashcardSet | null {
  const sets = getFlashcardSets(subject);
  return sets.find((set) => set.id === setId) || null;
}
