import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam"

const sampleQuestions = [
  // Physics Questions
  {
    subject: "Physics",
    question: "What is the SI unit of electric current?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correct: 1,
    explanation: "The SI unit of electric current is the Ampere (A), named after André-Marie Ampère.",
    difficulty: "easy",
    examType: "WAEC",
    tags: ["electricity", "units"],
  },
  {
    subject: "Physics",
    question:
      "Which law states that the force between two charges is inversely proportional to the square of the distance between them?",
    options: ["Ohm's Law", "Coulomb's Law", "Newton's Law", "Faraday's Law"],
    correct: 1,
    explanation: "Coulomb's Law describes the electrostatic force between electrically charged particles.",
    difficulty: "medium",
    examType: "WAEC",
    tags: ["electricity", "laws"],
  },

  // Chemistry Questions
  {
    subject: "Chemistry",
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
    explanation: "The chemical symbol for Gold is Au, derived from the Latin word 'aurum'.",
    difficulty: "easy",
    examType: "WAEC",
    tags: ["elements", "symbols"],
  },
  {
    subject: "Chemistry",
    question: "What type of bond is formed when electrons are shared between atoms?",
    options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
    correct: 1,
    explanation: "A covalent bond is formed when atoms share electrons to achieve stable electron configurations.",
    difficulty: "medium",
    examType: "WAEC",
    tags: ["bonding", "electrons"],
  },

  // Biology Questions
  {
    subject: "Biology",
    question: "Which organelle is known as the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"],
    correct: 2,
    explanation:
      "Mitochondria are called the powerhouse of the cell because they produce ATP, the cell's main energy currency.",
    difficulty: "easy",
    examType: "WAEC",
    tags: ["cell-biology", "organelles"],
  },
  {
    subject: "Biology",
    question: "What is the process by which plants make their own food?",
    options: ["Respiration", "Photosynthesis", "Transpiration", "Digestion"],
    correct: 1,
    explanation:
      "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.",
    difficulty: "easy",
    examType: "WAEC",
    tags: ["photosynthesis", "plants"],
  },

  // Mathematics Questions
  {
    subject: "Mathematics",
    question: "What is the value of π (pi) to 2 decimal places?",
    options: ["3.14", "3.15", "3.16", "3.13"],
    correct: 0,
    explanation: "π (pi) is approximately 3.14159..., which rounds to 3.14 to 2 decimal places.",
    difficulty: "easy",
    examType: "WAEC",
    tags: ["constants", "geometry"],
  },
  {
    subject: "Mathematics",
    question: "If 2x + 5 = 15, what is the value of x?",
    options: ["5", "10", "7.5", "2.5"],
    correct: 0,
    explanation: "2x + 5 = 15, so 2x = 10, therefore x = 5.",
    difficulty: "medium",
    examType: "WAEC",
    tags: ["algebra", "equations"],
  },

  // Economics Questions
  {
    subject: "Economics",
    question: "What does GDP stand for?",
    options: [
      "Gross Domestic Product",
      "General Development Plan",
      "Global Distribution Process",
      "Government Debt Policy",
    ],
    correct: 0,
    explanation:
      "GDP stands for Gross Domestic Product, which measures the total value of goods and services produced in a country.",
    difficulty: "easy",
    examType: "WAEC",
    tags: ["macroeconomics", "indicators"],
  },
  {
    subject: "Economics",
    question: "What is the law of demand?",
    options: [
      "Price and quantity demanded move in the same direction",
      "Price and quantity demanded move in opposite directions",
      "Price has no effect on quantity demanded",
      "Quantity demanded is always constant",
    ],
    correct: 1,
    explanation:
      "The law of demand states that as price increases, quantity demanded decreases, and vice versa, all other factors being equal.",
    difficulty: "medium",
    examType: "WAEC",
    tags: ["microeconomics", "demand"],
  },
]

const sampleFlashcards = [
  {
    subject: "Physics",
    title: "Physics Fundamentals",
    cards: [
      {
        front: "What is Newton's First Law?",
        back: "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
      },
      {
        front: "Define Velocity",
        back: "Velocity is the rate of change of displacement with respect to time. It's a vector quantity.",
      },
      { front: "What is the formula for Force?", back: "F = ma (Force equals mass times acceleration)" },
      { front: "What is acceleration?", back: "Acceleration is the rate of change of velocity with respect to time." },
    ],
    createdAt: new Date(),
    difficulty: "medium",
  },
  {
    subject: "Chemistry",
    title: "Chemical Bonds",
    cards: [
      {
        front: "What is an ionic bond?",
        back: "An ionic bond is formed when electrons are transferred from one atom to another, creating charged ions.",
      },
      {
        front: "Define covalent bond",
        back: "A covalent bond is formed when atoms share electrons to achieve stable electron configurations.",
      },
      {
        front: "What is electronegativity?",
        back: "Electronegativity is the ability of an atom to attract electrons in a chemical bond.",
      },
    ],
    createdAt: new Date(),
    difficulty: "medium",
  },
  {
    subject: "Biology",
    title: "Cell Biology",
    cards: [
      {
        front: "What is mitosis?",
        back: "Mitosis is the process of cell division that results in two identical diploid cells.",
      },
      { front: "Function of ribosomes", back: "Ribosomes are responsible for protein synthesis in cells." },
      {
        front: "What is DNA?",
        back: "DNA (Deoxyribonucleic acid) is the hereditary material that contains genetic instructions.",
      },
    ],
    createdAt: new Date(),
    difficulty: "easy",
  },
]

async function seedDatabase() {
  console.log("Starting database seeding...")
  console.log("MongoDB URI:", uri ? "Set" : "Not set")

  if (!uri || uri === "mongodb://localhost:27017/groupxam") {
    console.log("⚠️  Using local MongoDB. Make sure MongoDB is running locally or set MONGODB_URI environment variable.")
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db("groupxam")

    // Test connection
    await db.admin().ping()
    console.log("✅ Database connection verified")

    // Clear existing data
    const questionsResult = await db.collection("questions").deleteMany({})
    const flashcardsResult = await db.collection("flashcards").deleteMany({})
    console.log(`🗑️  Cleared ${questionsResult.deletedCount} existing questions`)
    console.log(`🗑️  Cleared ${flashcardsResult.deletedCount} existing flashcards`)

    // Insert sample questions
    const questionsInsert = await db.collection("questions").insertMany(sampleQuestions)
    console.log(`✅ Inserted ${questionsInsert.insertedCount} sample questions`)

    // Insert sample flashcards
    const flashcardsInsert = await db.collection("flashcards").insertMany(sampleFlashcards)
    console.log(`✅ Inserted ${flashcardsInsert.insertedCount} flashcard sets`)

    // Create indexes for better performance
    await db.collection("questions").createIndex({ subject: 1 })
    await db.collection("questions").createIndex({ difficulty: 1 })
    await db.collection("questions").createIndex({ examType: 1 })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    console.log("✅ Created database indexes")

    console.log("🎉 Database seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error.message)
    if (error.code === "ENOTFOUND") {
      console.log("💡 This might be a connection issue. Check your MongoDB URI.")
    }
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

seedDatabase()
