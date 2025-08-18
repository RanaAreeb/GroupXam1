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

// Medicine imports
import pathologyFlashcards from "./data/medicine/pathology.json";
import immunologyFlashcards from "./data/medicine/immunology.json";
import cardiologyFlashcards from "./data/medicine/cardiology.json";
import neurologyFlashcards from "./data/medicine/neurology.json";
import pediatricsFlashcards from "./data/medicine/pediatrics.json";

// Business imports
import businessManagementFlashcards from "./data/business/business-management.json";
import marketingFlashcards from "./data/business/marketing.json";
import humanResourcesFlashcards from "./data/business/human-resources.json";
import operationsManagementFlashcards from "./data/business/operations-management.json";
import strategicManagementFlashcards from "./data/business/strategic-management.json";
import entrepreneurshipFlashcards from "./data/business/entrepreneurship.json";
import internationalBusinessFlashcards from "./data/business/international-business.json";
import supplyChainManagementFlashcards from "./data/business/supply-chain-management.json";
import projectManagementFlashcards from "./data/business/project-management.json";
import businessEthicsFlashcards from "./data/business/business-ethics.json";

// Law imports
import constitutionalLawFlashcards from "./data/law/constitutional-law.json";
import criminalLawFlashcards from "./data/law/criminal-law.json";
import civilLawFlashcards from "./data/law/civil-law.json";
import contractLawFlashcards from "./data/law/contract-law.json";
import tortLawFlashcards from "./data/law/tort-law.json";
import propertyLawFlashcards from "./data/law/property-law.json";
import corporateLawFlashcards from "./data/law/corporate-law.json";
import internationalLawFlashcards from "./data/law/international-law.json";
import environmentalLawFlashcards from "./data/law/environmental-law.json";
import humanRightsLawFlashcards from "./data/law/human-rights-law.json";

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

  // Medicine
  anatomy: anatomyFlashcards as FlashcardData,
  physiology: physiologyFlashcards as FlashcardData,
  pathology: pathologyFlashcards as FlashcardData,
  pharmacology: pharmacologyFlashcards as FlashcardData,
  microbiology: microbiologyFlashcards as FlashcardData,
  biochemistry: biochemistryFlashcards as FlashcardData,
  immunology: immunologyFlashcards as FlashcardData,
  cardiology: cardiologyFlashcards as FlashcardData,
  neurology: neurologyFlashcards as FlashcardData,
  pediatrics: pediatricsFlashcards as FlashcardData,

  // Business
  "business management": businessManagementFlashcards as FlashcardData,
  marketing: marketingFlashcards as FlashcardData,
  "human resources": humanResourcesFlashcards as FlashcardData,
  "operations management": operationsManagementFlashcards as FlashcardData,
  "strategic management": strategicManagementFlashcards as FlashcardData,
  entrepreneurship: entrepreneurshipFlashcards as FlashcardData,
  "international business": internationalBusinessFlashcards as FlashcardData,
  "supply chain management": supplyChainManagementFlashcards as FlashcardData,
  "project management": projectManagementFlashcards as FlashcardData,
  "business ethics": businessEthicsFlashcards as FlashcardData,

  // Law
  "constitutional law": constitutionalLawFlashcards as FlashcardData,
  "criminal law": criminalLawFlashcards as FlashcardData,
  "civil law": civilLawFlashcards as FlashcardData,
  "contract law": contractLawFlashcards as FlashcardData,
  "tort law": tortLawFlashcards as FlashcardData,
  "property law": propertyLawFlashcards as FlashcardData,
  "corporate law": corporateLawFlashcards as FlashcardData,
  "international law": internationalLawFlashcards as FlashcardData,
  "environmental law": environmentalLawFlashcards as FlashcardData,
  "human rights law": humanRightsLawFlashcards as FlashcardData,
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
