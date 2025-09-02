"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Camera,
  Edit,
  Save,
  X,
  Award,
  BarChart3,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Star,
  Upload,
  Download,
  Settings,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Trophy,
  Zap,
  Activity,
  Users,
  FileText,
  Eye,
  School,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  phone?: string;
  country?: string;
  city?: string;
  school?: string;
  grade?: string;
  bio?: string;
  profilePicture?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

interface UserStats {
  totalExams: number;
  completedExams: number;
  totalQuizzes: number;
  averageScore: number;
  totalStudyTime: number;
  currentStreak: number;
  bestScore: number;
  rank: number;
  achievements: string[];
  recentActivity: any[];
}

export default function ProfilePage() {
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    role: "",
    phone: "",
    country: "",
    city: "",
    school: "",
    grade: "",
    bio: "",
    profilePicture: "",
  });

  const [stats, setStats] = useState<UserStats>({
    totalExams: 0,
    completedExams: 0,
    totalQuizzes: 0,
    averageScore: 0,
    totalStudyTime: 0,
    currentStreak: 0,
    bestScore: 0,
    rank: 0,
    achievements: [],
    recentActivity: [],
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [originalProfile, setOriginalProfile] = useState<UserProfile>({
    name: "",
    email: "",
    role: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);

  // Load user profile and stats
  useEffect(() => {
    if (user && isLoggedIn) {
      const userProfile = {
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        phone: user.phone || "",
        country: user.country || "",
        city: user.city || "",
        school: user.school || "",
        grade: user.grade || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      };
      setProfile(userProfile);
      setOriginalProfile(userProfile);
      fetchUserStats();
    }
  }, [user, isLoggedIn]);

  const fetchUserStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const response = await fetch("/api/profile/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setStatsError("Failed to load statistics");
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      setStatsError("Network error loading statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setOriginalProfile(profile);
        setEditing(false);
        // Show success message
      } else {
        // Show error message
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditing(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Enhanced validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      alert(`File size is ${sizeMB}MB. Please select an image smaller than 5MB.`);
      return;
    }

    // Check image dimensions
    try {
      const dimensions = await getImageDimensions(file);
      if (dimensions.width < 50 || dimensions.height < 50) {
        alert("Image must be at least 50x50 pixels");
        return;
      }
    } catch (error) {
      console.error("Error checking image dimensions:", error);
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/profile/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({ ...prev, profilePicture: data.imageUrl }));
        
        // Trigger auth state refresh to update navbar
        window.dispatchEvent(new CustomEvent('auth-state-changed'));
        
        // Show success message
        console.log("Profile picture updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Helper function to get image dimensions
  const getImageDimensions = (file: File): Promise<{width: number, height: number}> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student": return <GraduationCap className="w-5 h-5" />;
      case "university": return <School className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getGradeOptions = () => {
    const grades = [];
    // K-12 grades
    for (let i = 1; i <= 12; i++) {
      grades.push(`Grade ${i}`);
    }
    // University levels
    grades.push("Freshman", "Sophomore", "Junior", "Senior", "Graduate", "PhD");
    return grades;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Header />

      {/* Profile Header */}
      <section className="bg-white/80 backdrop-blur-sm border-b border-white/60">
        <div className="container mx-auto py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-emerald-400 to-blue-500">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Upload button */}
                <label className={`absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 ${
                  uploadingImage 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-110'
                }`}>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </label>
                
                {/* Upload status */}
                {uploadingImage && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-black/75 text-white text-xs px-2 py-1 rounded">
                      Uploading...
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
                  <Badge className="flex items-center gap-1">
                    {getRoleIcon(profile.role)}
                    {profile.role === "student" ? "Student" : "Institution"}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-4">{profile.email}</p>
                
                {profile.bio && (
                  <p className="text-gray-700 mb-4 max-w-2xl">{profile.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {profile.school && (
                    <div className="flex items-center gap-1">
                      <School className="w-4 h-4" />
                      {profile.school}
                    </div>
                  )}
                  {profile.grade && (
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {profile.grade}
                    </div>
                  )}
                  {profile.city && profile.country && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.city}, {profile.country}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(profile.createdAt)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {editing ? (
                  <>
                    <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditing(true)} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-8">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {statsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : statsError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{statsError}</p>
                    <Button onClick={fetchUserStats} variant="outline">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Quick Stats */}
                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Exams Completed</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.completedExams}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Quizzes Completed</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalQuizzes}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Target className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Average Score</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.averageScore}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Current Streak</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.currentStreak} days</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Recent Activity & Achievements */}
                {!statsLoading && !statsError && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stats.recentActivity.length > 0 ? (
                            stats.recentActivity.slice(0, 5).map((activity, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <p className="font-medium">{activity.title}</p>
                                  <p className="text-sm text-gray-600">{activity.description}</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatDate(activity.date)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-8">No recent activity</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          Achievements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {stats.achievements.length > 0 ? (
                            stats.achievements.map((achievement, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <Trophy className="w-5 h-5 text-yellow-600" />
                                <span className="font-medium text-yellow-800">{achievement}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-8">No achievements yet</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Statistics Tab */}
              <TabsContent value="stats" className="space-y-6">
                {statsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Card key={i} className="bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : statsError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{statsError}</p>
                    <Button onClick={fetchUserStats} variant="outline">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <FileText className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Total Exams</p>
                          <p className="text-3xl font-bold text-gray-800">{stats.totalExams}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Exams Completed</p>
                          <p className="text-3xl font-bold text-gray-800">{stats.completedExams}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Quizzes Completed</p>
                          <p className="text-3xl font-bold text-gray-800">{stats.totalQuizzes}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Best Score</p>
                          <p className="text-3xl font-bold text-gray-800">{stats.bestScore}%</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Global Rank</p>
                          <p className="text-3xl font-bold text-gray-800">#{stats.rank || "N/A"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Progress Chart Placeholder */}
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Performance Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">Performance chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-500 text-center py-8">Activity timeline will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                {editing ? (
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="school">School/Institution</Label>
                          <Input
                            id="school"
                            value={profile.school}
                            onChange={(e) => setProfile(prev => ({ ...prev, school: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="grade">Grade/Level</Label>
                          <Select
                            value={profile.grade}
                            onValueChange={(value) => setProfile(prev => ({ ...prev, grade: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade/level" />
                            </SelectTrigger>
                            <SelectContent>
                              {getGradeOptions().map((grade) => (
                                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={profile.country}
                            onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={profile.city}
                            onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button onClick={() => setEditing(true)} className="w-full md:w-auto">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile Information
                        </Button>
                        
                        <div className="border-t pt-4">
                          <h3 className="font-semibold mb-2">Account Information</h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>Member since: {formatDate(profile.createdAt)}</p>
                            <p>Last login: {formatDate(profile.lastLoginAt)}</p>
                            <p>Account type: {profile.role}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}

