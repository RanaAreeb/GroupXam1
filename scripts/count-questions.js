const fs = require('fs');
const path = require('path');

function countQuestionsInDirectory(dirPath) {
    let count = 0;

    try {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                count += countQuestionsInDirectory(fullPath);
            } else if (item.endsWith('.json')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const data = JSON.parse(content);

                    // Count questions based on common structures
                    if (data.questions && Array.isArray(data.questions)) {
                        count += data.questions.length;
                    } else if (data.quiz && Array.isArray(data.quiz)) {
                        count += data.quiz.length;
                    } else if (data.flashcards && Array.isArray(data.flashcards)) {
                        count += data.flashcards.length;
                    } else if (data.sets && Array.isArray(data.sets)) {
                        // Handle flashcard data with sets
                        for (const set of data.sets) {
                            if (set.cards && Array.isArray(set.cards)) {
                                count += set.cards.length;
                            }
                        }
                    } else if (data.sections && Array.isArray(data.sections)) {
                        // Handle exam data with sections
                        for (const section of data.sections) {
                            if (section.questions && Array.isArray(section.questions)) {
                                count += section.questions.length;
                            }
                        }
                    } else if (data.topics && Array.isArray(data.topics)) {
                        // Handle WASSCE data with topics
                        for (const topic of data.topics) {
                            if (topic.questions && Array.isArray(topic.questions)) {
                                count += topic.questions.length;
                            }
                        }
                    } else if (Array.isArray(data)) {
                        count += data.length;
                    }
                } catch (parseError) {
                    console.log(`Error parsing ${fullPath}:`, parseError);
                }
            }
        }
    } catch (error) {
        console.log(`Error reading directory ${dirPath}:`, error);
    }

    return count;
}

// Count questions from JSON files in the data directories
const dataDirectories = [
    'app/exams/jamb/data',
    'app/exams/waec/data',
    'app/exams/wassce/data',
    'app/quiz/data',
    'app/flashcards/data'
];

let totalQuestions = 0;
const breakdown = {};

console.log('Current working directory:', process.cwd());

for (const dir of dataDirectories) {
    try {
        const fullPath = path.join(process.cwd(), dir);
        console.log(`\nChecking directory: ${fullPath}`);

        if (fs.existsSync(fullPath)) {
            const count = countQuestionsInDirectory(fullPath);
            totalQuestions += count;
            breakdown[dir] = count;
            console.log(`✓ Counted ${count} questions from ${dir}`);
        } else {
            console.log(`✗ Directory not found: ${dir}`);
            breakdown[dir] = 0;
        }
    } catch (error) {
        console.log(`✗ Error counting questions in ${dir}:`, error);
        breakdown[dir] = 0;
    }
}

console.log('\n=== QUESTION COUNT BREAKDOWN ===');
console.log(JSON.stringify(breakdown, null, 2));
console.log(`\nTOTAL QUESTIONS: ${totalQuestions.toLocaleString()}`);
