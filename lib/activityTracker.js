// Activity tracking utility for quiz completions and study activities

export const trackQuizCompletion = async (quizData) => {
    try {
        const response = await fetch('/api/activity/quiz-completion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quizData),
        });

        if (!response.ok) {
            console.error('Failed to track quiz completion:', response.statusText);
        }

        return response.ok;
    } catch (error) {
        console.error('Error tracking quiz completion:', error);
        return false;
    }
};

export const trackFlashcardCompletion = async (flashcardData) => {
    try {
        const response = await fetch('/api/activity/quiz-completion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...flashcardData,
                quizType: 'flashcard',
                score: flashcardData.completed ? 1 : 0,
                totalQuestions: 1,
            }),
        });

        if (!response.ok) {
            console.error('Failed to track flashcard completion:', response.statusText);
        }

        return response.ok;
    } catch (error) {
        console.error('Error tracking flashcard completion:', error);
        return false;
    }
};

export const updateUserStats = async (statsUpdate) => {
    try {
        const response = await fetch('/api/stats/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(statsUpdate),
        });

        if (!response.ok) {
            console.error('Failed to update user stats:', response.statusText);
        }

        return response.ok;
    } catch (error) {
        console.error('Error updating user stats:', error);
        return false;
    }
};

// Helper function to determine quiz subject from exam context
export const getQuizSubject = (examData, fallbackSubject = 'General') => {
    if (examData?.subject) return examData.subject;
    if (examData?.name && typeof examData.name === 'string') {
        // Extract subject from exam name
        const subjectMatch = examData.name.match(/^([A-Za-z\s]+)/);
        return subjectMatch ? subjectMatch[1].trim() : fallbackSubject;
    }
    return fallbackSubject;
};

// Helper function to generate quiz type based on context
export const getQuizType = (context) => {
    if (context.includes('mock')) return 'mock-exam';
    if (context.includes('flashcard')) return 'flashcard';
    if (context.includes('practice')) return 'practice-quiz';
    return 'quiz';
};
