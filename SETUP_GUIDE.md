# groupXam Setup Guide for Visual Studio Code

This guide will help you set up and run the groupXam study app in Visual Studio Code.

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- [ ] **Visual Studio Code** - [Download here](https://code.visualstudio.com/)
- [ ] **Git** - [Download here](https://git-scm.com/)
- [ ] **MongoDB** (local) OR **MongoDB Atlas** account

## 🚀 Step-by-Step Setup

### Step 1: Download and Extract Project

1. Download the project files
2. Extract to your desired location
3. Open the folder in Visual Studio Code

### Step 2: Install Recommended Extensions

VS Code will prompt you to install recommended extensions. Click "Install All" or install manually:

- **Prettier** - Code formatter
- **ESLint** - Code linting
- **Tailwind CSS IntelliSense** - CSS autocomplete
- **TypeScript and JavaScript Language Features**

### Step 3: Install Dependencies

Open the integrated terminal in VS Code (`Ctrl+`` ` or `View > Terminal`) and run:

\`\`\`bash
npm install
\`\`\`

### Step 4: Set Up Environment Variables

1. Create a new file called `.env.local` in the root directory
2. Add the following content:

\`\`\`bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/groupxam

# JWT Secret (replace with a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
\`\`\`

#### For MongoDB Atlas (Cloud Database):
Replace the MONGODB_URI with your Atlas connection string:
\`\`\`bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/groupxam
\`\`\`

#### Generate a Secure JWT Secret:
In the terminal, run:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`
Copy the output and replace the JWT_SECRET value.

### Step 5: Set Up Database

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. The default connection string will work

#### Option B: MongoDB Atlas
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `.env.local` with your Atlas URI

### Step 6: Seed the Database

Run the database seeding script:

\`\`\`bash
npm run seed
\`\`\`

This will populate your database with sample questions and flashcards.

### Step 7: Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

## 🔧 VS Code Configuration

The project includes VS Code configuration files:

- **`.vscode/settings.json`** - Editor settings and formatting
- **`.vscode/extensions.json`** - Recommended extensions
- **`.vscode/launch.json`** - Debug configurations

## 🐛 Debugging in VS Code

### Debug Server-Side Code:
1. Set breakpoints in your API routes
2. Press `F5` or go to `Run and Debug`
3. Select "Next.js: debug server-side"

### Debug Client-Side Code:
1. Set breakpoints in your React components
2. Select "Next.js: debug client-side"
3. This will open Chrome with debugging enabled

## 📁 Project Structure Overview

\`\`\`
groupxam-study-app/
├── 📁 app/                 # Next.js pages and API routes
│   ├── 📁 api/            # Backend API endpoints
│   ├── 📁 dashboard/      # Dashboard page
│   ├── 📁 quiz/          # Quiz functionality
│   └── 📄 page.tsx       # Home page
├── 📁 components/         # Reusable React components
├── 📁 lib/               # Utility functions
├── 📁 scripts/           # Database scripts
├── 📄 .env.local         # Environment variables (create this)
├── 📄 package.json       # Dependencies and scripts
└── 📄 README.md          # Project documentation
\`\`\`

## 🎯 Quick Test

After setup, test your installation:

1. Visit `http://localhost:3000/setup` to verify configuration
2. Visit `http://localhost:3000/env-setup` for detailed setup help
3. Create an account at `http://localhost:3000/signup`
4. Start using the app!

## 🔍 Troubleshooting

### Common Issues:

**"Module not found" errors:**
\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

**Database connection failed:**
- Check if MongoDB is running (local setup)
- Verify connection string in `.env.local`
- Ensure network access is allowed (Atlas setup)

**Environment variables not loading:**
- Ensure `.env.local` is in the root directory
- Restart the development server
- Check for typos in variable names

**Port 3000 already in use:**
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

## 📚 Development Workflow

1. **Make changes** to your code
2. **Save files** - Prettier will auto-format
3. **Check terminal** for any errors
4. **Test in browser** - Hot reload is enabled
5. **Use debugger** when needed

## 🚀 Building for Production

When ready to deploy:

\`\`\`bash
npm run build
npm start
\`\`\`

## 🆘 Getting Help

If you encounter issues:

1. Check this setup guide
2. Visit `/setup` page in the app
3. Check the main README.md
4. Look at the troubleshooting section

---

**You're all set! Happy coding with groupXam! 🎓**
