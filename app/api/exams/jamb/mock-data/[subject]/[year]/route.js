import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Function to load exam data from JSON files
const loadExamData = (subject, year) => {
    try {
        // Map subject names to folder and file names
        let folderName = '';
        let fileName = '';

        if (subject === 'Use of English') {
            // First try the new "Use of English" folder
            folderName = 'Use of English';
            if (year === 2010) {
                fileName = 'use-of-english-2010.json';
            } else if (year === 2011) {
                fileName = 'use-of-english-2011.json';
            } else if (year === 2013) {
                fileName = 'use-of-english-2013.json';
            }
            // If file doesn't exist in new folder, fall back to old folder
            const newFilePath = path.join(process.cwd(), 'app', 'exams', 'jamb', 'data', folderName, fileName);
            if (!fs.existsSync(newFilePath)) {
                folderName = 'english-mock-exam';
                if (year === 2010) {
                    fileName = 'english-2010.json';
                }
            }
        } else if (subject === 'Mathematics') {
            folderName = 'mathematics-mock-exam';
            if (year === 2010) {
                fileName = 'jamb-mathematics-2010.json';
            } else if (year === 2011) {
                fileName = 'jamb-mathematics-2011.json';
            } else if (year === 2012) {
                fileName = 'jamb-mathematics-2012.json';
            } else if (year === 2013) {
                fileName = 'jamb-mathematics-2013.json';
            }
        } else if (subject === 'Chemistry') {
            folderName = 'Chemistry';
            if (year === 2010) {
                fileName = 'jamb-chemistry-2010.json';
            } else if (year === 2011) {
                fileName = 'jamb-chemistry-2011.json';
            } else if (year === 2012) {
                fileName = 'jamb-chemistry-2012.json';
            } else if (year === 2013) {
                fileName = 'jamb-chemistry-2013.json';
            } else if (year === 2014) {
                fileName = 'chemistry-2014.json';
            }
        } else if (subject === 'Literature in English') {
            folderName = 'english-mock-exam';
            if (year === 2011) {
                fileName = 'literature-2011.json';
            } else if (year === 2012) {
                fileName = 'literature-2012.json';
            } else if (year === 2013) {
                fileName = 'literature-2013.json';
            } else if (year === 2014) {
                fileName = 'literature-2014.json';
            } else if (year === 2015) {
                fileName = 'literature-2015.json';
            }
        } else if (subject === 'Government') {
            folderName = 'government-mock-exam';
            if (year === 2010) {
                fileName = 'government-2010.json';
            } else if (year === 2011) {
                fileName = 'government-2011.json';
            } else if (year === 2012) {
                fileName = 'government-2012.json';
            } else if (year === 2013) {
                fileName = 'government-2013.json';
            }
        }

        if (folderName && fileName) {
            const filePath = path.join(process.cwd(), 'app', 'exams', 'jamb', 'data', folderName, fileName);
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const parsed = JSON.parse(fileContent);
                // If the file is an array (like government), wrap it in the expected object
                if (Array.isArray(parsed)) {
                    return {
                        id: `${subject.toLowerCase().replace(/ /g, '-')}-${year}`,
                        title: `JAMB ${subject} ${year}`,
                        subject,
                        year,
                        duration: '2 hours',
                        questions: parsed
                    };
                }
                return parsed;
            }
        }
        return null;
    } catch (error) {
        console.error('Error loading exam data:', error);
        return null;
    }
};

// Fallback mock data for subjects/years not in JSON files
const mockExamData = {
    "Use of English": {
        2011: {
            id: "english-2011",
            title: "JAMB Use of English 2011",
            subject: "Use of English",
            year: 2011,
            duration: "2 hours",
            questions: [
                {
                    id: 1,
                    question: "Select the word that means the opposite of 'generous':",
                    options: ["kind", "stingy", "friendly", "helpful"],
                    correctAnswer: 1
                },
                {
                    id: 2,
                    question: "Choose the correct sentence:",
                    options: [
                        "The data is being analyzed",
                        "The data are being analyzed",
                        "The datas is being analyzed",
                        "The datas are being analyzed"
                    ],
                    correctAnswer: 1
                },
                {
                    id: 3,
                    question: "Identify the figure of speech: 'The wind whispered through the trees.'",
                    options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
                    correctAnswer: 2
                },
                {
                    id: 4,
                    question: "Choose the correct preposition: She is good _____ mathematics.",
                    options: ["at", "in", "on", "with"],
                    correctAnswer: 0
                },
                {
                    id: 5,
                    question: "Which word is a synonym for 'enormous'?",
                    options: ["small", "huge", "tiny", "little"],
                    correctAnswer: 1
                }
            ]
        },
        2012: {
            id: "english-2012",
            title: "JAMB Use of English 2012",
            subject: "Use of English",
            year: 2012,
            duration: "2 hours",
            questions: [
                {
                    id: 1,
                    question: "Choose the correct form of the verb: The committee _____ to meet next week.",
                    options: ["decide", "decides", "decided", "deciding"],
                    correctAnswer: 1
                },
                {
                    id: 2,
                    question: "Identify the type of clause: 'When the rain stopped, we went outside.'",
                    options: ["Independent clause", "Dependent clause", "Noun clause", "Adjective clause"],
                    correctAnswer: 1
                },
                {
                    id: 3,
                    question: "Choose the word that best fits: The _____ of the story was unexpected.",
                    options: ["climax", "climaxes", "climax's", "climaxs"],
                    correctAnswer: 0
                },
                {
                    id: 4,
                    question: "Which sentence is grammatically correct?",
                    options: [
                        "Between you and I, this is wrong",
                        "Between you and me, this is wrong",
                        "Between you and myself, this is wrong",
                        "Between yourself and I, this is wrong"
                    ],
                    correctAnswer: 1
                },
                {
                    id: 5,
                    question: "Choose the correct article: _____ university is located in the city center.",
                    options: ["A", "An", "The", "No article"],
                    correctAnswer: 2
                }
            ]
        }
    },
    "Mathematics": {
        2011: {
            id: "math-2011",
            title: "JAMB Mathematics 2011",
            subject: "Mathematics",
            year: 2011,
            duration: "2 hours",
            questions: [
                {
                    id: 1,
                    question: "Factorize: x² - 9",
                    options: ["(x+3)(x-3)", "(x+9)(x-9)", "(x+3)(x+3)", "(x-3)(x-3)"],
                    correctAnswer: 0
                },
                {
                    id: 2,
                    question: "What is the value of sin 30°?",
                    options: ["1/2", "√3/2", "1", "0"],
                    correctAnswer: 0
                },
                {
                    id: 3,
                    question: "Find the nth term of the sequence: 3, 7, 11, 15, ...",
                    options: ["4n-1", "4n+1", "3n+1", "3n-1"],
                    correctAnswer: 0
                },
                {
                    id: 4,
                    question: "What is the probability of getting a head when tossing a fair coin?",
                    options: ["1/4", "1/2", "3/4", "1"],
                    correctAnswer: 1
                },
                {
                    id: 5,
                    question: "Solve: 3x - 2y = 8 and x + y = 4",
                    options: ["x=3, y=1", "x=2, y=2", "x=4, y=0", "x=1, y=3"],
                    correctAnswer: 1
                }
            ]
        }
    },
    "Literature in English": {
        2010: {
            id: "literature-2010",
            title: "JAMB Literature in English 2010",
            subject: "Literature in English",
            year: 2010,
            duration: "2 hours",
            questions: [
                {
                    id: 1,
                    question: "Who wrote 'Things Fall Apart'?",
                    options: ["Wole Soyinka", "Chinua Achebe", "Gabriel Okara", "Amos Tutuola"],
                    correctAnswer: 1
                },
                {
                    id: 2,
                    question: "What is a sonnet?",
                    options: ["A 12-line poem", "A 14-line poem", "A 16-line poem", "A 10-line poem"],
                    correctAnswer: 1
                },
                {
                    id: 3,
                    question: "In 'Romeo and Juliet', who gives Romeo the poison?",
                    options: ["Friar Lawrence", "The Apothecary", "Mercutio", "Balthasar"],
                    correctAnswer: 1
                },
                {
                    id: 4,
                    question: "What literary device is used in 'The stars danced in the sky'?",
                    options: ["Simile", "Metaphor", "Personification", "Alliteration"],
                    correctAnswer: 2
                },
                {
                    id: 5,
                    question: "Who is the protagonist in 'The Lion and the Jewel'?",
                    options: ["Baroka", "Lakunle", "Sidi", "All of the above"],
                    correctAnswer: 2
                }
            ]
        },
        2012: {
            id: "literature-2012",
            title: "JAMB Literature in English 2012",
            subject: "Literature in English",
            year: 2012,
            duration: "2 hours",
            questions: [
                {
                    id: 1,
                    question: "What is the setting of 'The Concubine'?",
                    options: ["Lagos", "Omokachi", "Ibadan", "Kano"],
                    correctAnswer: 1
                },
                {
                    id: 2,
                    question: "Who wrote 'The Beautiful Ones Are Not Yet Born'?",
                    options: ["Ayi Kwei Armah", "Kofi Awoonor", "Ama Ata Aidoo", "Efua Sutherland"],
                    correctAnswer: 0
                },
                {
                    id: 3,
                    question: "What is the rhyme scheme of a Shakespearean sonnet?",
                    options: ["ABAB CDCD EFEF GG", "ABBA ABBA CDECDE", "ABAB BCBC CDCD EE", "AABB CCDD EEFF GG"],
                    correctAnswer: 0
                },
                {
                    id: 4,
                    question: "In 'She Stoops to Conquer', who is Kate Hardcastle?",
                    options: ["The protagonist", "The antagonist", "A minor character", "The narrator"],
                    correctAnswer: 0
                },
                {
                    id: 5,
                    question: "What does the 'green light' symbolize in 'The Great Gatsby'?",
                    options: ["Hope and dreams", "Money", "Jealousy", "Nature"],
                    correctAnswer: 0
                }
            ]
        }
    }
};

export async function GET(request, { params }) {
    try {
        const { subject, year } = params;

        // Decode URL parameters
        const decodedSubject = decodeURIComponent(subject);
        const decodedYear = parseInt(year);

        // First try to load from JSON file
        const jsonData = loadExamData(decodedSubject, decodedYear);
        if (jsonData) {
            return NextResponse.json(jsonData);
        }

        // Fallback to mock data
        if (!mockExamData[decodedSubject] || !mockExamData[decodedSubject][decodedYear]) {
            return NextResponse.json(
                { error: `No exam data found for ${decodedSubject} ${decodedYear}` },
                { status: 404 }
            );
        }

        const examData = mockExamData[decodedSubject][decodedYear];

        return NextResponse.json(examData);
    } catch (error) {
        console.error('Error fetching JAMB exam data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch exam data' },
            { status: 500 }
        );
    }
} 