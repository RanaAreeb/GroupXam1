# groupXam - Study Prep Web App

A comprehensive study preparation platform for WAEC/WASSCE exams built with Next.js, MongoDB, and Tailwind CSS.

## 🚀 Features

- **sunu-I AI Chatbot**: Intelligent AI-powered study assistant that answers student queries 24/7
- **Quiz System**: Interactive quizzes with instant feedback
- **Flashcards**: Smart flashcard system for memorization
- **Discussion Forums**: Community-driven learning
- **Progress Tracking**: Detailed analytics and performance tracking
- **Exam Simulation**: Timed practice exams
- **Multi-Subject Support**: Physics, Chemistry, Biology, Mathematics, Economics, and more

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (version 8.0.0 or higher)
- **Git** (for cloning the repository)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🛠️ Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd groupxam-study-app
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

\`\`\`bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/groupxam
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/groupxam

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# OpenAI API Key (for sunu-I AI Chatbot)
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here
\`\`\`

#### MongoDB Setup Options:

**Option A: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/groupxam`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Get connection string and replace `<password>`
4. Use the Atlas connection string

#### Generate JWT Secret:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

### 4. Database Setup

Seed the database with sample data:

\`\`\`bash
npm run seed
\`\`\`

### 5. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

## 🎯 Quick Start Guide

1. **Visit Setup Page**: Go to `http://localhost:3000/env-setup` for detailed setup instructions
2. **Test Configuration**: Visit `http://localhost:3000/setup` to verify your setup
3. **Create Account**: Sign up at `http://localhost:3000/signup`
4. **Start Learning**: Access your dashboard and begin studying!

## 📁 Project Structure

\`\`\`
groupxam-study-app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── quiz/             # Quiz functionality
│   ├── flashcards/       # Flashcard system
│   ├── discussions/      # Discussion forums
│   └── ...
├── components/           # Reusable UI components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utility functions
├── scripts/             # Database seeding scripts
├── public/              # Static assets
└── ...
\`\`\`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data
- `npm run setup` - Install dependencies and seed database

## 🎨 Customization

### Adding New Subjects
1. Update the subjects array in `app/signup/page.tsx`
2. Add sample questions in `scripts/seed-database.js`
3. Update subject filters throughout the app

### Modifying Questions
Edit the `sampleQuestions` array in `scripts/seed-database.js` and run:
\`\`\`bash
npm run seed
\`\`\`

### Styling Changes
- Modify Tailwind classes in components
- Update `tailwind.config.ts` for theme changes
- Edit `app/globals.css` for global styles

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
1. Build the project: `npm run build`
2. Upload `dist` folder to your hosting provider
3. Set environment variables
4. Start with: `npm start`

## 🔍 Troubleshooting

### Common Issues:

**Database Connection Failed**
- Check MongoDB is running (local) or connection string (Atlas)
- Verify network access in MongoDB Atlas
- Ensure environment variables are set correctly

**Module Not Found Errors**
- Run `npm install` to install dependencies
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Environment Variables Not Loading**
- Ensure `.env.local` is in root directory
- Restart development server after changes
- Check variable names match exactly

**Build Errors**
- Run `npm run lint` to check for code issues
- Ensure all dependencies are installed
- Check Node.js version compatibility

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Data Endpoints
- `GET /api/questions` - Fetch questions
- `GET /api/test-db` - Test database connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Visit `/env-setup` for setup help
3. Visit `/setup` to test your configuration
4. Create an issue on GitHub

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Happy Learning with groupXam! 🎓**
