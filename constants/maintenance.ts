export interface MaintenanceSectionConfig {
  id: string;
  label: string;
  description: string;
  defaultMessage: string;
}

export const MAINTENANCE_SECTIONS: MaintenanceSectionConfig[] = [
  {
    id: "whole_site",
    label: "Entire Platform",
    description: "Disable all public pages and show a site-wide maintenance message.",
    defaultMessage:
      "GroupXam is temporarily unavailable while we complete essential maintenance. We appreciate your patience and will be back shortly.",
  },
  {
    id: "ai_chat",
    label: "AI Chat (sunu-I)",
    description: "Pause all AI assistant interactions, including the chat page and homepage quick ask form.",
    defaultMessage:
      "sunu-I is currently undergoing scheduled maintenance. Please check back soon for your AI-powered study help.",
  },
  {
    id: "calculator",
    label: "Calculator Suite",
    description: "Temporarily disable the advanced calculator tools across the platform.",
    defaultMessage:
      "Our calculator tools are currently offline for improvements. Thanks for bearing with us!",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    description: "Hide flashcard study tools while maintenance is in progress.",
    defaultMessage:
      "Flashcards are under maintenance and will be back shortly.",
  },
  {
    id: "study_groups",
    label: "Study Groups",
    description: "Disable study group and discussion features temporarily.",
    defaultMessage:
      "Study group discussions are paused while we complete maintenance. Please try again soon.",
  },
  {
    id: "exams",
    label: "Practice Exams",
    description: "Put the exam practice area into maintenance mode.",
    defaultMessage:
      "Practice exams are currently unavailable as we enhance the experience. Thanks for your patience!",
  },
];
