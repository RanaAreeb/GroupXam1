// Import all flashcard data from JSON files
import physicsFlashcards from "./data/sciences/physics.json";
import chemistryFlashcards from "./data/sciences/chemistry.json";
import biologyFlashcards from "./data/sciences/biology.json";
import anatomyFlashcards from "./data/sciences/anatomy.json";
import physiologyFlashcards from "./data/sciences/physiology.json";
import microbiologyFlashcards from "./data/sciences/microbiology.json";
import biochemistryFlashcards from "./data/sciences/biochemistry.json";
import pharmacologyFlashcards from "./data/sciences/pharmacology.json";
import ecologyFlashcards from "./data/sciences/ecology.json";
import psychologyFlashcards from "./data/sciences/psychology.json";

import algebraFlashcards from "./data/mathematics/algebra.json";
import calculusFlashcards from "./data/mathematics/calculus.json";
import statisticsFlashcards from "./data/mathematics/statistics.json";
import arithmeticFlashcards from "./data/mathematics/arithmetic.json";
import geometryFlashcards from "./data/mathematics/geometry.json";
import trigonometryFlashcards from "./data/mathematics/trigonometry.json";
import pythagoreanTheoremFlashcards from "./data/mathematics/pythagorean-theorem.json";

import englishFlashcards from "./data/arts-humanities/english.json";
import literatureFlashcards from "./data/arts-humanities/literature.json";
import historyFlashcards from "./data/arts-humanities/history.json";
import geographyFlashcards from "./data/arts-humanities/geography.json";
import philosophyFlashcards from "./data/arts-humanities/philosophy.json";
import sociologyFlashcards from "./data/arts-humanities/sociology.json";
import artHistoryFlashcards from "./data/arts-humanities/art-history.json";
import musicTheoryFlashcards from "./data/arts-humanities/music-theory.json";
import creativeWritingFlashcards from "./data/arts-humanities/creative-writing.json";
import foreignLanguagesFlashcards from "./data/arts-humanities/foreign-languages.json";
import religiousStudiesFlashcards from "./data/arts-humanities/religious-studies.json";
import culturalStudiesFlashcards from "./data/arts-humanities/cultural-studies.json";

import economicsFlashcards from "./data/economics/economics.json";
import microEconomicsFlashcards from "./data/economics/micro-economics.json";
import macroEconomicsFlashcards from "./data/economics/macro-economics.json";
import accountingFlashcards from "./data/economics/accounting.json";
import financeFlashcards from "./data/economics/finance.json";
import politicalScienceFlashcards from "./data/economics/political-science.json";

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

// Map subjects to their data files
const flashcardData: Record<string, FlashcardData> = {
  // Sciences
  physics: physicsFlashcards as FlashcardData,
  chemistry: chemistryFlashcards as FlashcardData,
  biology: biologyFlashcards as FlashcardData,
  anatomy: anatomyFlashcards as FlashcardData,
  physiology: physiologyFlashcards as FlashcardData,
  microbiology: microbiologyFlashcards as FlashcardData,
  biochemistry: biochemistryFlashcards as FlashcardData,
  pharmacology: pharmacologyFlashcards as FlashcardData,
  ecology: ecologyFlashcards as FlashcardData,
  psychology: psychologyFlashcards as FlashcardData,

  // Mathematics
  algebra: algebraFlashcards as FlashcardData,
  calculus: calculusFlashcards as FlashcardData,
  statistics: statisticsFlashcards as FlashcardData,
  arithmetic: arithmeticFlashcards as FlashcardData,
  geometry: geometryFlashcards as FlashcardData,
  trigonometry: trigonometryFlashcards as FlashcardData,
  "pythagorean theorem": pythagoreanTheoremFlashcards as FlashcardData,

  // Arts & Humanities
  english: englishFlashcards as FlashcardData,
  literature: literatureFlashcards as FlashcardData,
  history: historyFlashcards as FlashcardData,
  geography: geographyFlashcards as FlashcardData,
  philosophy: philosophyFlashcards as FlashcardData,
  sociology: sociologyFlashcards as FlashcardData,
  "art history": artHistoryFlashcards as FlashcardData,
  "music theory": musicTheoryFlashcards as FlashcardData,
  "creative writing": creativeWritingFlashcards as FlashcardData,
  "foreign languages": foreignLanguagesFlashcards as FlashcardData,
  "religious studies": religiousStudiesFlashcards as FlashcardData,
  "cultural studies": culturalStudiesFlashcards as FlashcardData,

  // Economics
  economics: economicsFlashcards as FlashcardData,
  "micro economics": microEconomicsFlashcards as FlashcardData,
  "macro economics": macroEconomicsFlashcards as FlashcardData,
  accounting: accountingFlashcards as FlashcardData,
  finance: financeFlashcards as FlashcardData,
  "political science": politicalScienceFlashcards as FlashcardData,
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
