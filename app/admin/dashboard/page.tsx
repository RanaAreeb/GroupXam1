"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  TrendingUp,
  Calendar as CalendarIcon,
  Globe,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Eye,
  UserCheck,
  Clock,
  MapPin,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AdminStats {
  totalUsers: number;
  dailySignups: number;
  weeklySignups: number;
  monthlySignups: number;
  yearlySignups: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  yearlyActiveUsers: number;
  countries: { country: string; count: number; fullName: string }[];
  activities: {
    _id: string;
    message: string;
    timestamp: string;
    userId?: string;
    userEmail?: string;
    userName?: string;
  }[];
  users: {
    _id: string;
    name: string;
    email: string;
    role: string;
    country: string;
    createdAt: string;
    isVerified: boolean;
    status: string;
  }[];
}

export default function AdminDashboard() {
  const { isLoggedIn, user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDateRangeLoading, setIsDateRangeLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [selectedPeriod, setSelectedPeriod] = useState<string>("custom");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.email === "ranaareeb1029@gmail.com" || user?.email === "cliftonmanneh6@gmail.com";

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }
      
      if (!isAdmin) {
        router.push("/");
        return;
      }
    }
  }, [isLoggedIn, loading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats();
    }
  }, [isAdmin, dateRange, selectedPeriod]);

  // Auto-refresh when date range changes
  useEffect(() => {
    if (isAdmin && selectedPeriod === 'custom' && dateRange?.from && dateRange?.to) {
      setIsDateRangeLoading(true);
      const timeoutId = setTimeout(() => {
        fetchAdminStats();
      }, 500); // Small delay to avoid too many requests
      
      return () => clearTimeout(timeoutId);
    }
  }, [dateRange, selectedPeriod]);

    const fetchAdminStats = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (selectedPeriod === 'custom' && dateRange?.from && dateRange?.to) {
        // For custom range, send the exact date range
        params.append('startDate', dateRange.from.toISOString());
        params.append('endDate', dateRange.to.toISOString());
        params.append('period', 'custom');
      } else if (selectedPeriod !== 'custom') {
        // For predefined periods, send the period
        params.append('period', selectedPeriod);
      } else {
        // Default to current month if no selection
        params.append('period', 'month');
      }
      
      console.log('Fetching with params:', params.toString());
      
      const response = await fetch(`/api/admin/stats?${params.toString()}`);
      const data = await response.json();
      
             if (data.success) {
         setStats(data.stats);
         setLastUpdated(new Date());
       } else {
         console.error('API returned error:', data.error);
       }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setIsLoading(false);
      setIsDateRangeLoading(false);
    }
  };

  const exportData = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/export?type=${type}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
             <div className="flex items-center justify-between">
               <div>
                 <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                 <p className="text-emerald-100">Welcome back, {user?.name}</p>
               </div>
               <div className="flex items-center gap-4">
                 <Button
                   onClick={() => router.push('/')}
                   variant="outline"
                   size="sm"
                   className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                 >
                   ← Back to Home
                 </Button>
                 {/* Date Range Selector */}
                 <div className="flex items-center gap-2">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="5years">Last 5 Years</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedPeriod === 'custom' && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                
                <Button
                  onClick={fetchAdminStats}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                                 <Badge variant="secondary" className="bg-white/20 text-white">
                   Last updated: {lastUpdated.toLocaleTimeString()}
                 </Badge>
                 {selectedPeriod === 'custom' && dateRange?.from && dateRange?.to && (
                   <Badge variant="outline" className={`bg-white/10 text-white border-white/30 ${isDateRangeLoading ? 'opacity-50' : ''}`}>
                     {isDateRangeLoading ? (
                       <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                     ) : null}
                     {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                   </Badge>
                 )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading admin statistics...</p>
            </div>
          ) : stats ? (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="geography">Geography</TabsTrigger>
              </TabsList>

                             {/* Overview Tab */}
               <TabsContent value="overview" className="space-y-6">
                 {/* Date Range Summary */}
                 {selectedPeriod === 'custom' && dateRange?.from && dateRange?.to && (
                   <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                     <CardContent className="pt-6">
                       <div className="flex items-center justify-between">
                         <div>
                           <h3 className="text-lg font-semibold text-blue-800">Custom Date Range</h3>
                           <p className="text-sm text-blue-600">
                             {format(dateRange.from, "MMMM dd, yyyy")} - {format(dateRange.to, "MMMM dd, yyyy")}
                           </p>
                         </div>
                         <Badge variant="secondary" className="bg-blue-600 text-white">
                           {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
                         </Badge>
                       </div>
                     </CardContent>
                   </Card>
                 )}
                 
                 {/* Key Metrics */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                                               <Dialog>
                       <DialogTrigger asChild>
                         <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 cursor-pointer hover:shadow-xl transition-shadow">
                           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                             <CardTitle className="text-sm font-medium text-emerald-800">Total Users</CardTitle>
                             <Users className="h-4 w-4 text-emerald-600" />
                           </CardHeader>
                           <CardContent>
                             <div className="text-2xl font-bold text-emerald-700">{stats.totalUsers.toLocaleString()}</div>
                             <p className="text-xs text-emerald-600">
                               All registered users
                             </p>
                           </CardContent>
                         </Card>
                       </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>All Users ({stats.totalUsers})</DialogTitle>
                        </DialogHeader>
                                                 <div className="space-y-4">
                           {stats.users && stats.users.length > 0 ? (
                             stats.users.map((user) => (
                            <div key={user._id} className="p-4 border rounded-lg bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                  <p className="text-sm text-gray-600">{user.email}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {user.role}
                                    </Badge>
                                    <Badge variant={user.isVerified ? "default" : "secondary"} className="text-xs">
                                      {user.isVerified ? "Verified" : "Unverified"}
                                    </Badge>
                                    <Badge variant={user.status === "active" ? "default" : "destructive"} className="text-xs">
                                      {user.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                  <div>Country: {user.country}</div>
                                  <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </div>
                          ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No users found</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                                     <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                       <CardTitle className="text-sm font-medium text-blue-800">Daily Active Users</CardTitle>
                       <UserCheck className="h-4 w-4 text-blue-600" />
                     </CardHeader>
                     <CardContent>
                       <div className="text-2xl font-bold text-blue-700">{stats.dailyActiveUsers.toLocaleString()}</div>
                       <p className="text-xs text-blue-600">
                         Active in last 24 hours
                       </p>
                     </CardContent>
                   </Card>

                   <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                       <CardTitle className="text-sm font-medium text-purple-800">Weekly Active Users</CardTitle>
                       <TrendingUp className="h-4 w-4 text-purple-600" />
                     </CardHeader>
                     <CardContent>
                       <div className="text-2xl font-bold text-purple-700">{stats.weeklyActiveUsers.toLocaleString()}</div>
                       <p className="text-xs text-purple-600">
                         Active in last 7 days
                       </p>
                     </CardContent>
                   </Card>

                   <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                       <CardTitle className="text-sm font-medium text-orange-800">Monthly Active Users</CardTitle>
                       <CalendarIcon className="h-4 w-4 text-orange-600" />
                     </CardHeader>
                     <CardContent>
                       <div className="text-2xl font-bold text-orange-700">{stats.monthlyActiveUsers.toLocaleString()}</div>
                       <p className="text-xs text-orange-600">
                         Active in last 30 days
                       </p>
                     </CardContent>
                   </Card>
                </div>

                                 {/* Signup Trends */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
                     <CardHeader>
                       <CardTitle className="text-emerald-800">Signup Trends</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-4">
                         <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                           <span className="text-sm font-medium text-emerald-700">Today</span>
                           <span className="text-sm font-bold text-emerald-600">
                             {stats.dailySignups}
                           </span>
                         </div>
                         <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                           <span className="text-sm font-medium text-blue-700">This Week</span>
                           <span className="text-sm font-bold text-blue-600">
                             {stats.weeklySignups}
                           </span>
                         </div>
                         <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                           <span className="text-sm font-medium text-purple-700">This Month</span>
                           <span className="text-sm font-bold text-purple-600">
                             {stats.monthlySignups}
                           </span>
                         </div>
                         <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                           <span className="text-sm font-medium text-orange-700">This Year</span>
                           <span className="text-sm font-bold text-orange-600">
                             {stats.yearlySignups}
                           </span>
                         </div>
                       </div>
                     </CardContent>
                   </Card>

                                     <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                     <CardHeader>
                       <CardTitle className="text-blue-800">Active User Trends</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-4">
                         <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                           <span className="text-sm font-medium text-emerald-700">Daily Active</span>
                           <span className="text-sm font-bold text-emerald-600">
                             {stats.dailyActiveUsers}
                           </span>
                         </div>
                         <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                           <span className="text-sm font-medium text-blue-700">Weekly Active</span>
                           <span className="text-sm font-bold text-blue-600">
                             {stats.weeklyActiveUsers}
                           </span>
                         </div>
                         <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                           <span className="text-sm font-medium text-purple-700">Monthly Active</span>
                           <span className="text-sm font-bold text-purple-600">
                             {stats.monthlyActiveUsers}
                           </span>
                         </div>
                         <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                           <span className="text-sm font-medium text-orange-700">Yearly Active</span>
                           <span className="text-sm font-bold text-orange-600">
                             {stats.yearlyActiveUsers}
                           </span>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                </div>
              </TabsContent>

                             {/* Users Tab */}
               <TabsContent value="users" className="space-y-6">
                 <Card>
                   <CardHeader>
                     <div className="flex items-center justify-between">
                       <CardTitle>User Statistics</CardTitle>
                       <Button
                         onClick={() => exportData('users')}
                         variant="outline"
                         size="sm"
                       >
                         <Download className="w-4 h-4 mr-2" />
                         Export
                       </Button>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                       <Dialog>
                         <DialogTrigger asChild>
                           <div className="text-center p-4 bg-emerald-50 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors">
                             <div className="text-2xl font-bold text-emerald-600">
                               {stats.dailySignups}
                             </div>
                             <div className="text-sm text-gray-600">Today's Signups</div>
                           </div>
                         </DialogTrigger>
                         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                           <DialogHeader>
                             <DialogTitle>Today's Signups ({stats.dailySignups})</DialogTitle>
                           </DialogHeader>
                           <div className="space-y-4">
                             {stats.users?.filter(user => {
                               const userDate = new Date(user.createdAt);
                               const today = new Date();
                               return userDate.toDateString() === today.toDateString();
                             }).map((user) => (
                               <div key={user._id} className="p-4 border rounded-lg bg-gray-50">
                                 <div className="flex items-center justify-between">
                                   <div>
                                     <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                     <p className="text-sm text-gray-600">{user.email}</p>
                                     <div className="flex items-center gap-2 mt-1">
                                       <Badge variant="outline" className="text-xs">
                                         {user.role}
                                       </Badge>
                                       <Badge variant={user.isVerified ? "default" : "secondary"} className="text-xs">
                                         {user.isVerified ? "Verified" : "Unverified"}
                                       </Badge>
                                       <Badge variant={user.status === "active" ? "default" : "destructive"} className="text-xs">
                                         {user.status}
                                       </Badge>
                                     </div>
                                   </div>
                                   <div className="text-right text-sm text-gray-500">
                                     <div>Country: {user.country}</div>
                                     <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </DialogContent>
                       </Dialog>

                       <Dialog>
                         <DialogTrigger asChild>
                           <div className="text-center p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                             <div className="text-2xl font-bold text-blue-600">
                               {stats.weeklySignups}
                             </div>
                             <div className="text-sm text-gray-600">This Week</div>
                           </div>
                         </DialogTrigger>
                         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                           <DialogHeader>
                             <DialogTitle>This Week's Signups ({stats.weeklySignups})</DialogTitle>
                           </DialogHeader>
                           <div className="space-y-4">
                             {stats.users?.filter(user => {
                               const userDate = new Date(user.createdAt);
                               const weekAgo = new Date();
                               weekAgo.setDate(weekAgo.getDate() - 7);
                               return userDate >= weekAgo;
                             }).map((user) => (
                               <div key={user._id} className="p-4 border rounded-lg bg-gray-50">
                                 <div className="flex items-center justify-between">
                                   <div>
                                     <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                     <p className="text-sm text-gray-600">{user.email}</p>
                                     <div className="flex items-center gap-2 mt-1">
                                       <Badge variant="outline" className="text-xs">
                                         {user.role}
                                       </Badge>
                                       <Badge variant={user.isVerified ? "default" : "secondary"} className="text-xs">
                                         {user.isVerified ? "Verified" : "Unverified"}
                                       </Badge>
                                       <Badge variant={user.status === "active" ? "default" : "destructive"} className="text-xs">
                                         {user.status}
                                       </Badge>
                                     </div>
                                   </div>
                                   <div className="text-right text-sm text-gray-500">
                                     <div>Country: {user.country}</div>
                                     <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </DialogContent>
                       </Dialog>

                       <Dialog>
                         <DialogTrigger asChild>
                           <div className="text-center p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                             <div className="text-2xl font-bold text-purple-600">
                               {stats.monthlySignups}
                             </div>
                             <div className="text-sm text-gray-600">This Month</div>
                           </div>
                         </DialogTrigger>
                         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                           <DialogHeader>
                             <DialogTitle>This Month's Signups ({stats.monthlySignups})</DialogTitle>
                           </DialogHeader>
                           <div className="space-y-4">
                             {stats.users?.filter(user => {
                               const userDate = new Date(user.createdAt);
                               const monthAgo = new Date();
                               monthAgo.setMonth(monthAgo.getMonth() - 1);
                               return userDate >= monthAgo;
                             }).map((user) => (
                               <div key={user._id} className="p-4 border rounded-lg bg-gray-50">
                                 <div className="flex items-center justify-between">
                                   <div>
                                     <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                     <p className="text-sm text-gray-600">{user.email}</p>
                                     <div className="flex items-center gap-2 mt-1">
                                       <Badge variant="outline" className="text-xs">
                                         {user.role}
                                       </Badge>
                                       <Badge variant={user.isVerified ? "default" : "secondary"} className="text-xs">
                                         {user.isVerified ? "Verified" : "Unverified"}
                                       </Badge>
                                       <Badge variant={user.status === "active" ? "default" : "destructive"} className="text-xs">
                                         {user.status}
                                       </Badge>
                                     </div>
                                   </div>
                                   <div className="text-right text-sm text-gray-500">
                                     <div>Country: {user.country}</div>
                                     <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </DialogContent>
                       </Dialog>

                       <Dialog>
                         <DialogTrigger asChild>
                           <div className="text-center p-4 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
                             <div className="text-2xl font-bold text-orange-600">
                               {stats.yearlySignups}
                             </div>
                             <div className="text-sm text-gray-600">This Year</div>
                           </div>
                         </DialogTrigger>
                         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                           <DialogHeader>
                             <DialogTitle>This Year's Signups ({stats.yearlySignups})</DialogTitle>
                           </DialogHeader>
                           <div className="space-y-4">
                             {stats.users?.filter(user => {
                               const userDate = new Date(user.createdAt);
                               const yearAgo = new Date();
                               yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                               return userDate >= yearAgo;
                             }).map((user) => (
                               <div key={user._id} className="p-4 border rounded-lg bg-gray-50">
                                 <div className="flex items-center justify-between">
                                   <div>
                                     <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                     <p className="text-sm text-gray-600">{user.email}</p>
                                     <div className="flex items-center gap-2 mt-1">
                                       <Badge variant="outline" className="text-xs">
                                         {user.role}
                                       </Badge>
                                       <Badge variant={user.isVerified ? "default" : "secondary"} className="text-xs">
                                         {user.isVerified ? "Verified" : "Unverified"}
                                       </Badge>
                                       <Badge variant={user.status === "active" ? "default" : "destructive"} className="text-xs">
                                         {user.status}
                                       </Badge>
                                     </div>
                                   </div>
                                   <div className="text-right text-sm text-gray-500">
                                     <div>Country: {user.country}</div>
                                     <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </DialogContent>
                       </Dialog>
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Activity Log</CardTitle>
                      <Button
                        onClick={() => exportData('activity')}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Activity</TableHead>
                          </TableRow>
                        </TableHeader>
                                                 <TableBody>
                           {stats.activities && stats.activities.length > 0 ? (
                             stats.activities.map((activity) => (
                               <TableRow key={activity._id}>
                                 <TableCell className="text-sm">
                                   {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Invalid Date'}
                                 </TableCell>
                                 <TableCell className="text-sm">
                                   {activity.userEmail || activity.userName || 'Anonymous'}
                                 </TableCell>
                                 <TableCell className="text-sm">
                                   {activity.message}
                                 </TableCell>
                               </TableRow>
                             ))
                           ) : (
                             <TableRow>
                               <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                 No activities found. Activities will appear here when users perform actions.
                               </TableCell>
                             </TableRow>
                           )}
                         </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

                             {/* Geography Tab */}
               <TabsContent value="geography" className="space-y-6">
                 <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
                   <CardHeader>
                     <div className="flex items-center justify-between">
                       <CardTitle className="text-emerald-800">User Distribution by Country</CardTitle>
                       <Button
                         onClick={() => exportData('countries')}
                         variant="outline"
                         size="sm"
                         className="bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600"
                       >
                         <Download className="w-4 h-4 mr-2" />
                         Export
                       </Button>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-4">
                       {stats.countries.map((country, index) => (
                         <div key={country.country} className="flex items-center justify-between p-4 bg-white/70 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                           <div className="flex items-center gap-4">
                             <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                               <Globe className="w-4 h-4 text-emerald-600" />
                             </div>
                             <div>
                               <span className="font-semibold text-gray-800">{country.fullName || country.country}</span>
                               <div className="text-xs text-gray-500">{country.country}</div>
                             </div>
                           </div>
                           <div className="text-right">
                             <Badge variant="secondary" className="bg-emerald-600 text-white">
                               {country.count.toLocaleString()} users
                             </Badge>
                             <div className="text-xs text-gray-500 mt-1">
                               {((country.count / stats.totalUsers) * 100).toFixed(1)}% of total
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Failed to load admin statistics</p>
              <Button onClick={fetchAdminStats} className="mt-4">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
} 