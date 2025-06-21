"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Key, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EnvSetupPage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Environment Setup Guide</h1>
          <p className="text-gray-600">Configure your environment variables for groupXam</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* MongoDB Setup */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                MongoDB Setup
              </CardTitle>
              <CardDescription>Set up your MongoDB database connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Option 1: MongoDB Atlas (Cloud)</h4>
                <ol className="text-sm space-y-2 text-gray-600">
                  <li>
                    1. Go to{" "}
                    <a
                      href="https://mongodb.com/atlas"
                      target="_blank"
                      className="text-emerald-600 hover:underline"
                      rel="noreferrer"
                    >
                      MongoDB Atlas
                    </a>
                  </li>
                  <li>2. Create a free account and cluster</li>
                  <li>3. Get your connection string</li>
                  <li>4. Replace &lt;password&gt; with your database password</li>
                </ol>

                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Example connection string:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white p-2 rounded flex-1 overflow-x-auto">
                      mongodb+srv://username:password@cluster.mongodb.net/groupxam
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard("mongodb+srv://username:password@cluster.mongodb.net/groupxam")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Option 2: Local MongoDB</h4>
                <ol className="text-sm space-y-2 text-gray-600">
                  <li>1. Install MongoDB locally</li>
                  <li>2. Start MongoDB service</li>
                  <li>3. Use local connection string</li>
                </ol>

                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Local connection string:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white p-2 rounded flex-1">mongodb://localhost:27017/groupxam</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard("mongodb://localhost:27017/groupxam")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JWT Secret Setup */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                JWT Secret Setup
              </CardTitle>
              <CardDescription>Configure your JWT secret for authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Generate a Secure Secret</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Use a long, random string for security. Here are some options:
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Option 1: Random string</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-white p-2 rounded flex-1 overflow-x-auto">
                        your-super-secret-jwt-key-here-make-it-long-and-random
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("your-super-secret-jwt-key-here-make-it-long-and-random")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Option 2: Generate with Node.js</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-white p-2 rounded flex-1 overflow-x-auto">
                        node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard("node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"")
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environment File Setup */}
        <Card className="border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle>Environment File Setup</CardTitle>
            <CardDescription>Create your .env.local file with the following variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400"># .env.local</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onClick={() =>
                    copyToClipboard(`# groupXam Environment Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/groupxam
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random`)
                  }
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <div># groupXam Environment Variables</div>
                <div>MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/groupxam</div>
                <div>JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Create this file in your project root directory</li>
                <li>• Never commit .env.local to version control</li>
                <li>• Restart your development server after adding variables</li>
                <li>• Replace the example values with your actual credentials</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-0 shadow-lg mt-8 bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Next Steps</h3>
            <p className="mb-4">After setting up your environment variables:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white text-emerald-600 hover:bg-gray-100">
                <a href="/setup">Test Setup</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-emerald-600"
              >
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
