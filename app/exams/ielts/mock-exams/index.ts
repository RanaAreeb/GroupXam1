"use client";

// Import all mock exams
import { mockExam1 } from './mock-exam-1';
import { mockExam2 } from './mock-exam-2';
import { mockExam3 } from './mock-exam-3';
import { mockExam4 } from './mock-exam-4';

// Export all mock exams as an array
export const allMockExams = [mockExam1, mockExam2, mockExam3, mockExam4];

// Export individual mock exams for specific use cases
export { mockExam1, mockExam2, mockExam3, mockExam4 };

// Export the first mock exam as the default mock exam for backward compatibility
export const mockExam = mockExam1;
