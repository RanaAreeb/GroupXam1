"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useMaintenance } from "@/hooks/use-maintenance";
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
  Star,
  Calculator,
  AlertTriangle,
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
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { MaintenanceSetting } from "@/lib/maintenance";
import { MAINTENANCE_SECTIONS } from "@/constants/maintenance";

// Add Manual Payment Form Component
function AddManualPaymentForm({
  onSubmit,
  onCancel,
  formData,
  setFormData,
  isLoading
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  formData: any;
  setFormData: (data: any) => void;
  isLoading: boolean;
}) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };

      // Auto-set amount and duration based on package selection
      if (field === 'package') {
        switch (value) {
          case 'subscription-3month':
            newData.amount = '6.00';
            newData.duration = '90';
            newData.serviceType = 'premium';
            break;
          case 'subscription-6month':
            newData.amount = '12.00';
            newData.duration = '180';
            newData.serviceType = 'premium';
            break;
          case 'subscription-12month':
            newData.amount = '36.00';
            newData.duration = '365';
            newData.serviceType = 'premium';
            break;
          case 'monthly':
            newData.amount = '1.99';
            newData.duration = '30';
            newData.serviceType = 'ielts';
            break;
          case '6months':
            newData.amount = '14.99';
            newData.duration = '180';
            newData.serviceType = 'ielts';
            break;
          case 'yearly':
            newData.amount = '29.99';
            newData.duration = '365';
            newData.serviceType = 'ielts';
            break;
          case 'proctor_students':
            newData.amount = '2.00';
            newData.duration = '30';
            newData.serviceType = 'proctoring';
            break;
          case 'proctor_k12':
            newData.amount = '10.00';
            newData.duration = '30';
            newData.serviceType = 'proctoring';
            break;
          case 'proctor_universities':
            newData.amount = '20.00';
            newData.duration = '30';
            newData.serviceType = 'proctoring';
            break;
          case 'custom':
            newData.amount = '';
            newData.duration = '30';
            break;
        }
      }

      return newData;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="userEmail">User Email *</Label>
          <Input
            id="userEmail"
            type="email"
            value={formData.userEmail}
            onChange={(e) => handleChange('userEmail', e.target.value)}
            required
            placeholder="user@example.com"
          />
        </div>
        <div>
          <Label htmlFor="userName">User Name *</Label>
          <Input
            id="userName"
            value={formData.userName}
            onChange={(e) => handleChange('userName', e.target.value)}
            required
            placeholder="John Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="amount">Amount (USD) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
              placeholder="50"
              className="pl-8"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="package">Package/Service *</Label>
          <Select value={formData.package} onValueChange={(value) => handleChange('package', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subscription-3month">Premium 3 Months ($6.00)</SelectItem>
              <SelectItem value="subscription-6month">Premium 6 Months ($12.00)</SelectItem>
              <SelectItem value="subscription-12month">Premium 12 Months ($36.00) - 5% OFF</SelectItem>
              <SelectItem value="monthly">IELTS Monthly ($1.99)</SelectItem>
              <SelectItem value="6months">IELTS 6 Months ($14.99)</SelectItem>
              <SelectItem value="yearly">IELTS Yearly ($29.99)</SelectItem>
              <SelectItem value="proctor_students">ProctorIT Students ($2.00)</SelectItem>
              <SelectItem value="proctor_k12">ProctorIT K-12 Schools ($10.00)</SelectItem>
              <SelectItem value="proctor_universities">ProctorIT Universities ($20.00)</SelectItem>
              <SelectItem value="custom">Custom Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Duration (days) *</Label>
          <Select value={formData.duration} onValueChange={(value) => handleChange('duration', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="180">180 days</SelectItem>
              <SelectItem value="365">365 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => handleChange('paymentMethod', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="transactionId">Transaction ID</Label>
          <Input
            id="transactionId"
            value={formData.transactionId}
            onChange={(e) => handleChange('transactionId', e.target.value)}
            placeholder="TXN123456789"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="paymentDate">Payment Date *</Label>
        <Input
          id="paymentDate"
          type="date"
          value={formData.paymentDate}
          onChange={(e) => handleChange('paymentDate', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes about this payment..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Adding Payment...
            </>
          ) : (
            'Add Payment'
          )}
        </Button>
      </div>
    </form>
  );
}

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
  sessionData: {
    totalSessions: number;
    totalSessionTime: number;
    totalPageViews: number;
    averageSessionTime: number;
    activeUsers: number;
  };
  countries: { country: string; count: number; fullName: string }[];
  activities: {
    _id: string;
    message: string;
    timestamp: string;
    userId?: string;
    userEmail?: string;
    userName?: string;
    type?: string;
    sessionDuration?: number;
    pageViews?: number;
    actions?: string[];
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
  userSessionStats: {
    _id: string;
    userName: string;
    userEmail: string;
    totalSessions: number;
    totalSessionTime: number;
    totalPageViews: number;
    averageSessionTime: number;
    lastSessionAt: string;
    firstSessionAt: string;
  }[];
  reviews: {
    _id: string;
    name: string;
    initial: string;
    quote: string;
    details: string;
    rating: number;
    isApproved: boolean;
    createdAt: string;
    approvedAt?: string;
  }[];
  paymentStats?: {
    totalPayments: number;
    approvedPayments: number;
    pendingPayments: number;
    rejectedPayments: number;
    totalRevenue: number;
    recentPayments: any[];
  };
}

export default function AdminDashboard() {
  const { isLoggedIn, user, loading } = useAuth();
  const { maintenance: siteMaintenance } = useMaintenance("whole_site");
  const router = useRouter();
  const { toast } = useToast();
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
  const [selectedUserSessions, setSelectedUserSessions] = useState<any[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
  const [showUserSessionsModal, setShowUserSessionsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [pageAnalytics, setPageAnalytics] = useState<any[]>([]);
  const [showPageAnalyticsModal, setShowPageAnalyticsModal] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState<string | null>(null);
  const [isVerifyingUser, setIsVerifyingUser] = useState<string | null>(null);
  const [isApprovingReview, setIsApprovingReview] = useState<string | null>(null);
  const [isRejectingReview, setIsRejectingReview] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [calculatorAnalytics, setCalculatorAnalytics] = useState<any>(null);
  const [isLoadingCalculatorAnalytics, setIsLoadingCalculatorAnalytics] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showUserSelectionModal, setShowUserSelectionModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [isFixingAccess, setIsFixingAccess] = useState(false);
  const [formData, setFormData] = useState({
    userEmail: '',
    userName: '',
    amount: '',
    package: 'subscription-6month',
    duration: '180',
    paymentMethod: 'bank_transfer',
    transactionId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'approved',
    serviceType: 'premium'
  });

  // Alert management state
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [alertFormData, setAlertFormData] = useState({
    type: 'testimonial',
    title: 'Share Your Experience',
    message: 'We would love to hear about your experience with groupXam!',
    isActive: true,
    showOnce: true,
    expiresAt: '',
    buttonText: 'Leave Testimonial',
    buttonAction: 'open_testimonial'
  });

  // Email management state
  const [emailRecipients, setEmailRecipients] = useState<any[]>([]);
  const [isLoadingEmailRecipients, setIsLoadingEmailRecipients] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    subject: 'New Feature Update - GroupXam',
    message: '',
    template: 'feature_update',
    selectedUsers: [] as string[],
    productLink: '',
    productName: ''
  });
  const [emailSearchQuery, setEmailSearchQuery] = useState('');
  const [emailUserRoleFilter, setEmailUserRoleFilter] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [rangeSelection, setRangeSelection] = useState({
    startRange: '',
    endRange: '',
    isRangeMode: false
  });
  const [maintenanceSettings, setMaintenanceSettings] = useState<Record<string, MaintenanceSetting>>({});
  const [maintenanceDrafts, setMaintenanceDrafts] = useState<Record<string, string>>({});
  const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(false);
  const [savingMaintenance, setSavingMaintenance] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = user?.email === "ranaareeb1029@gmail.com" || user?.email === "cliftonmanneh6@gmail.com";
  const isWholeSiteMaintenanceActive = Boolean(siteMaintenance?.isActive);

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push(isWholeSiteMaintenanceActive ? "/login?admin-access=1" : "/login");
        return;
      }

      if (!isAdmin) {
        router.push("/");
        return;
      }
    }
  }, [isLoggedIn, loading, isAdmin, router, isWholeSiteMaintenanceActive]);

  const fetchMaintenanceSettings = useCallback(async () => {
    try {
      setIsLoadingMaintenance(true);
      const response = await fetch('/api/admin/maintenance');
      const data = await response.json();

      if (data.success) {
        const settingsRecord: Record<string, MaintenanceSetting> = {};
        (data.settings || []).forEach((setting: MaintenanceSetting) => {
          settingsRecord[setting.section] = setting;
        });
        setMaintenanceSettings(settingsRecord);

        const drafts: Record<string, string> = {};
        MAINTENANCE_SECTIONS.forEach((section) => {
          drafts[section.id] = settingsRecord[section.id]?.message || section.defaultMessage;
        });
        setMaintenanceDrafts(drafts);
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to load maintenance settings.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching maintenance settings:', error);
      toast({
        title: "Error",
        description: error?.message || 'Failed to load maintenance settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMaintenance(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats();
      fetchPayments();
      fetchUsers();
      fetchAlerts();
      fetchEmailRecipients();
      fetchMaintenanceSettings();
    }
  }, [isAdmin, dateRange, selectedPeriod, fetchMaintenanceSettings]);

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

  const fetchCalculatorAnalytics = async () => {
    setIsLoadingCalculatorAnalytics(true);
    try {
      const params = new URLSearchParams();
      if (dateRange?.from) {
        params.append('startDate', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.append('endDate', dateRange.to.toISOString());
      }

      const response = await fetch(`/api/calculator/usage?${params.toString()}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setCalculatorAnalytics(data.analytics);
      } else {
        const errorMessage = data.error || "Failed to fetch calculator analytics";
        console.error("Error fetching calculator analytics:", errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setCalculatorAnalytics(null);
      }
    } catch (error: any) {
      console.error("Error fetching calculator analytics:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch calculator analytics",
        variant: "destructive",
      });
      setCalculatorAnalytics(null);
    } finally {
      setIsLoadingCalculatorAnalytics(false);
    }
  };

  const handleMaintenanceUpdate = useCallback(
    async (section: string, updates: { isActive?: boolean; message?: string } = {}) => {
      if (!section) return;

      try {
        setSavingMaintenance(section);
        const currentSetting = maintenanceSettings[section];
        const sectionConfig = MAINTENANCE_SECTIONS.find((item) => item.id === section);
        const payload = {
          section,
          isActive: updates.isActive ?? currentSetting?.isActive ?? false,
          message:
            (updates.message ?? maintenanceDrafts[section] ?? sectionConfig?.defaultMessage) ||
            sectionConfig?.defaultMessage ||
            '',
        };

        const response = await fetch('/api/admin/maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to update maintenance setting.');
        }

        await fetchMaintenanceSettings();
        toast({
          title: 'Maintenance updated',
          description: `${sectionConfig?.label || section} is now ${payload.isActive ? 'in maintenance mode' : 'live'}.`,
          variant: payload.isActive ? 'destructive' : 'default',
        });
      } catch (error: any) {
        console.error('Failed to update maintenance setting:', error);
        toast({
          title: 'Error',
          description: error?.message || 'Failed to update maintenance setting.',
          variant: 'destructive',
        });
      } finally {
        setSavingMaintenance(null);
      }
    },
    [fetchMaintenanceSettings, maintenanceDrafts, maintenanceSettings, toast]
  );

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

  const viewUserSessions = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/admin/user-sessions?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (data.success) {
        setSelectedUserSessions(data.sessions);
        setSelectedUserEmail(userEmail);
        setShowUserSessionsModal(true);
      } else {
        console.error('Failed to fetch user sessions:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch user sessions:', error);
    }
  };

  const viewSessionDetails = (session: any) => {
    setSelectedSession(session);
    setShowSessionDetailsModal(true);
  };

  const viewUserPageAnalytics = async (userEmail: string) => {
    try {
      // Get page analytics for the specific user
      const response = await fetch(`/api/admin/page-analytics?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (data.success) {
        setPageAnalytics(data.pageAnalytics);
        setSelectedUserEmail(userEmail);
        setShowPageAnalyticsModal(true);
      } else {
        console.error('Failed to fetch page analytics:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch page analytics:', error);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete the account for ${userEmail}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeletingUser(userId);
      const response = await fetch(`/api/admin/delete-user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userEmail }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the stats to update the user list
        await fetchAdminStats();
        alert('User account deleted successfully');
      } else {
        alert(`Failed to delete user: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user account. Please try again.');
    } finally {
      setIsDeletingUser(null);
    }
  };

  const verifyUser = async (userId: string, userEmail: string) => {
    try {
      setIsVerifyingUser(userId);
      const response = await fetch(`/api/admin/verify-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userEmail }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the stats to update the user list
        await fetchAdminStats();
        alert('User verified successfully');
      } else {
        alert(`Failed to verify user: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to verify user:', error);
      alert('Failed to verify user. Please try again.');
    } finally {
      setIsVerifyingUser(null);
    }
  };

  const approveReview = async (reviewId: string) => {
    try {
      setIsApprovingReview(reviewId);
      const response = await fetch(`/api/admin/reviews`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId, action: "approve" }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchAdminStats();
        alert("Review approved successfully");
      } else {
        alert(`Failed to approve review: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to approve review:", error);
      alert("Failed to approve review. Please try again.");
    } finally {
      setIsApprovingReview(null);
    }
  };

  const rejectReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to reject this review? This action cannot be undone.")) {
      return;
    }

    try {
      setIsRejectingReview(reviewId);
      const response = await fetch(`/api/admin/reviews`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId, action: "reject" }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchAdminStats();
        alert("Review rejected successfully");
      } else {
        alert(`Failed to reject review: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to reject review:", error);
      alert("Failed to reject review. Please try again.");
    } finally {
      setIsRejectingReview(null);
    }
  };

  // Payment management functions
  const fetchPayments = async () => {
    try {
      setIsLoadingPayments(true);
      const response = await fetch('/api/admin/payments');
      const data = await response.json();

      if (data.success) {
        setPayments(data.payments);
      } else {
        console.error('Failed to fetch payments:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleUserSelection = (selectedUser: any) => {
    setFormData({
      userEmail: selectedUser.email,
      userName: selectedUser.name || selectedUser.email,
      amount: '12.00',
      package: 'subscription-6month',
      duration: '180',
      paymentMethod: 'bank_transfer',
      transactionId: '',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: '',
      status: 'approved',
      serviceType: 'premium'
    });
    setShowUserSelectionModal(false);
    setShowPaymentModal(true);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(userSearchQuery.toLowerCase()))
  );

  const activeMaintenanceCount = Object.values(maintenanceSettings).filter((setting) => setting?.isActive).length;

  // Fix user access based on their payments
  const fixUserAccess = async () => {
    try {
      setIsFixingAccess(true);

      // Get all users with approved payments
      const usersWithPayments = await Promise.all(
        users.map(async (user) => {
          const response = await fetch(`/api/admin/payments?userEmail=${user.email}`);
          const data = await response.json();
          const userPayments = data.payments || [];
          const latestPayment = userPayments
            .filter((p: any) => p.status === 'approved')
            .sort((a: any, b: any) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0];

          return { user, latestPayment };
        })
      );

      // Update each user's access
      for (const { user, latestPayment } of usersWithPayments) {
        if (latestPayment) {
          console.log(`Processing user: ${user.email}, Package: ${latestPayment.package}`);

          // Determine access based on package type
          let access = {};
          switch (latestPayment.package) {
            case 'subscription-3month':
            case 'subscription-6month':
            case 'subscription-12month':
              // Premium subscription grants access to ALL features
              access = {
                ielts: true,
                flashcards: true,
                studyGroups: true,
                aiTutor: true,
                whiteboard: true,
                mathHelp: true,
                proofreading: true,
                researchHelp: true,
                proctor: true,
                university: true,
                premium: true
              };
              break;
            case 'monthly':
            case '6months':
            case 'yearly':
              access = {
                ielts: true,
                proctor: latestPayment.package === '6months' || latestPayment.package === 'yearly',
                university: latestPayment.package === 'yearly'
              };
              break;
            case 'proctor_students':
              access = { proctor: true };
              break;
            case 'proctor_k12':
              access = { proctor: true };
              break;
            case 'proctor_universities':
              access = { proctor: true, university: true };
              break;
            default:
              access = { ielts: true };
          }

          console.log(`Setting access for ${user.email}:`, access);

          // Update user access via API
          await fetch('/api/admin/fix-access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userEmail: user.email,
              access,
              packageType: latestPayment.package,
              accessExpiresAt: latestPayment.expiresAt,
              lastPaymentDate: latestPayment.paymentDate
            })
          });
        }
      }

      // Refresh users and payments
      await fetchUsers();
      await fetchPayments();

      toast({
        title: "Success",
        description: "User access has been fixed based on their payments",
        variant: "default",
      });
    } catch (error) {
      console.error('Error fixing user access:', error);
      toast({
        title: "Error",
        description: "Failed to fix user access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFixingAccess(false);
    }
  };


  const processPayment = async (paymentId: string, action: 'approve' | 'reject') => {
    try {
      setIsProcessingPayment(paymentId);
      const response = await fetch(`/api/admin/payments`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId, action }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchPayments();
        await fetchAdminStats();
        alert(`Payment ${action}d successfully`);
      } else {
        alert(`Failed to ${action} payment: ${data.error}`);
      }
    } catch (error) {
      console.error(`Failed to ${action} payment:`, error);
      alert(`Failed to ${action} payment. Please try again.`);
    } finally {
      setIsProcessingPayment(null);
    }
  };

  const addManualPayment = async (paymentData: any) => {
    if (isAddingPayment) return; // Prevent duplicate submissions

    try {
      setIsAddingPayment(true);
      const response = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchPayments();
        await fetchAdminStats();
        setShowPaymentModal(false);
        toast({
          title: "Success",
          description: "Payment added successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to add payment: ${data.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to add payment:', error);
      toast({
        title: "Error",
        description: "Failed to add payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingPayment(false);
    }
  };

  // Alert management functions
  const fetchAlerts = async () => {
    try {
      setIsLoadingAlerts(true);
      const response = await fetch('/api/admin/alerts');
      const data = await response.json();

      if (data.success) {
        setAlerts(data.alerts || []);
      } else {
        console.error('Failed to fetch alerts:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  const createAlert = async (alertData: any) => {
    if (isCreatingAlert) return;

    try {
      setIsCreatingAlert(true);
      const response = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchAlerts();
        setShowCreateAlertModal(false);
        setAlertFormData({
          type: 'testimonial',
          title: 'Share Your Experience',
          message: 'We would love to hear about your experience with groupXam!',
          isActive: true,
          showOnce: true,
          expiresAt: '',
          buttonText: 'Leave Testimonial',
          buttonAction: 'open_testimonial'
        });
        toast({
          title: "Success",
          description: "Alert created successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to create alert: ${data.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to create alert:', error);
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAlert(false);
    }
  };

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/alerts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertId, isActive }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchAlerts();
        toast({
          title: "Success",
          description: `Alert ${isActive ? 'activated' : 'deactivated'} successfully`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to update alert: ${data.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to update alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/alerts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertId }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchAlerts();
        toast({
          title: "Success",
          description: "Alert deleted successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to delete alert: ${data.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to delete alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Email management functions
  const fetchEmailRecipients = async () => {
    try {
      setIsLoadingEmailRecipients(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (data.success) {
        setEmailRecipients(data.users);
      } else {
        console.error('Failed to fetch email recipients:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch email recipients:', error);
    } finally {
      setIsLoadingEmailRecipients(false);
    }
  };

  const sendEmails = async (emailData: any) => {
    if (isSendingEmails) return;

    try {
      setIsSendingEmails(true);
      const response = await fetch('/api/admin/send-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (data.success) {
        setEmailFormData({
          subject: 'New Feature Update - GroupXam',
          message: '',
          template: 'feature_update',
          selectedUsers: [],
          productLink: '',
          productName: ''
        });
        toast({
          title: "Success",
          description: `Emails sent successfully to ${data.sentCount} recipients`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to send emails: ${data.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to send emails:', error);
      toast({
        title: "Error",
        description: "Failed to send emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmails(false);
    }
  };

  const handleEmailUserSelection = (userId: string, isSelected: boolean) => {
    setEmailFormData(prev => {
      if (isSelected) {
        if (prev.selectedUsers.length >= 50) {
          toast({
            title: "Limit Reached",
            description: "You can only select up to 50 users due to email service limitations.",
            variant: "destructive",
          });
          return prev;
        }
        return {
          ...prev,
          selectedUsers: [...prev.selectedUsers, userId]
        };
      } else {
        return {
          ...prev,
          selectedUsers: prev.selectedUsers.filter(id => id !== userId)
        };
      }
    });
  };

  const selectAllUsers = () => {
    const filteredUsers = getFilteredEmailRecipients();
    const maxUsers = Math.min(50, filteredUsers.length);
    setEmailFormData(prev => ({
      ...prev,
      selectedUsers: filteredUsers.slice(0, maxUsers).map(user => user._id)
    }));
  };

  const clearAllUsers = () => {
    setEmailFormData(prev => ({
      ...prev,
      selectedUsers: []
    }));
  };

  const getFilteredEmailRecipients = () => {
    return emailRecipients.filter(user => {
      const matchesSearch = emailSearchQuery === '' ||
        user.name?.toLowerCase().includes(emailSearchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(emailSearchQuery.toLowerCase());
      const matchesRole = emailUserRoleFilter === 'all' || user.role === emailUserRoleFilter;
      return matchesSearch && matchesRole;
    });
  };

  const selectUsersByRange = () => {
    const start = parseInt(rangeSelection.startRange);
    const end = parseInt(rangeSelection.endRange);

    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      toast({
        title: "Invalid Range",
        description: "Please enter valid start and end numbers (e.g., 1-10, 100-115)",
        variant: "destructive",
      });
      return;
    }

    const filteredUsers = getFilteredEmailRecipients();
    const maxEnd = Math.min(end, filteredUsers.length);
    const maxStart = Math.min(start, filteredUsers.length);

    if (maxEnd - maxStart + 1 > 50) {
      toast({
        title: "Range Too Large",
        description: "Range cannot exceed 50 users. Please select a smaller range.",
        variant: "destructive",
      });
      return;
    }

    const selectedUserIds = filteredUsers
      .slice(maxStart - 1, maxEnd)
      .map(user => user._id);

    setEmailFormData(prev => ({
      ...prev,
      selectedUsers: selectedUserIds
    }));

    toast({
      title: "Users Selected",
      description: `Selected users ${maxStart} to ${maxEnd} (${selectedUserIds.length} users)`,
      variant: "default",
    });
  };

  const selectUsersByCount = (count: number) => {
    const filteredUsers = getFilteredEmailRecipients();
    const maxCount = Math.min(count, 50, filteredUsers.length);

    const selectedUserIds = filteredUsers
      .slice(0, maxCount)
      .map(user => user._id);

    setEmailFormData(prev => ({
      ...prev,
      selectedUsers: selectedUserIds
    }));

    toast({
      title: "Users Selected",
      description: `Selected first ${maxCount} users`,
      variant: "default",
    });
  };

  // Helper function to format session duration from seconds to readable format
  const formatSessionDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return '0 minutes';

    if (seconds > 86400) {
      // More than 24 hours, show as hours
      return `${Math.round(seconds / 3600)} hours`;
    } else if (seconds > 3600) {
      // More than 1 hour, show as hours and minutes
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } else {
      // Less than 1 hour, show as minutes
      return `${Math.round(seconds / 60)} minutes`;
    }
  };

  // Helper function to format page visit duration from seconds to readable format
  // Caps at 2 hours as page visits shouldn't be longer than that
  const formatPageVisitDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return '0 minutes';

    // Cap extremely large values that are likely tracking errors
    // For page visits, cap at 2 hours (7200 seconds) as a reasonable maximum
    const cappedSeconds = Math.min(seconds, 7200);

    if (cappedSeconds > 3600) {
      // More than 1 hour, show as hours and minutes
      const hours = Math.floor(cappedSeconds / 3600);
      const minutes = Math.round((cappedSeconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } else {
      // Less than 1 hour, show as minutes
      return `${Math.round(cappedSeconds / 60)} minutes`;
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
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Mobile Menu Button */}
              <div className="lg:hidden mb-4">
                <Button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>Admin Dashboard Menu</span>
                  <svg className={`w-4 h-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </div>

              {/* Vertical Sidebar Navigation */}
              <div className={`w-full lg:w-64 flex-shrink-0 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Dashboard</h3>
                  <nav className="space-y-2">
                    <div className="space-y-1">
                      <Button
                        variant={activeTab === 'overview' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('overview');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-4 h-4" />
                          <span>Overview</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTab === 'users' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('users');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4" />
                          <span>Users</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTab === 'activity' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('activity');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Activity className="w-4 h-4" />
                          <span>Activity</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTab === 'sessions' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('sessions');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4" />
                          <span>Sessions</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTab === 'geography' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('geography');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4" />
                          <span>Geography</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTab === 'reviews' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('reviews');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Star className="w-4 h-4" />
                          <span>Reviews</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTab === 'payments' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('payments');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          <span>Payments</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTab === 'alerts' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('alerts');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 3h5v5h-5V3z" />
                          </svg>
                          <span>Alerts</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTab === 'emails' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('emails');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Emails</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTab === 'calculator' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('calculator');
                          setIsMobileMenuOpen(false);
                          fetchCalculatorAnalytics();
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Calculator className="w-4 h-4" />
                          <span>Calculator Analytics</span>
                        </div>
                      </Button>
                      <Button
                        variant={activeTab === 'maintenance' ? 'default' : 'ghost'}
                        className="w-full justify-start text-left py-3 px-4 h-auto"
                        onClick={() => {
                          setActiveTab('maintenance');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Maintenance</span>
                        </div>
                      </Button>
                    </div>
                  </nav>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                <div className="space-y-6">

                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
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

                            {/* Filter Section */}
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex flex-col gap-4">
                                {/* Search Bar */}
                                <div>
                                  <label className="text-sm font-medium text-gray-700 mb-2 block">Search Users</label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="text"
                                      placeholder="Search by name or email..."
                                      value={userSearchQuery}
                                      onChange={(e) => setUserSearchQuery(e.target.value)}
                                      className="flex-1"
                                    />
                                    {userSearchQuery && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setUserSearchQuery('')}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        Clear
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {/* Role Filter */}
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                  <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Role</label>
                                    <div className="flex gap-2">
                                      <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                                        <SelectTrigger className="w-full sm:w-48">
                                          <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="all">All Users</SelectItem>
                                          <SelectItem value="student">Students</SelectItem>
                                          <SelectItem value="university">Universities</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      {userRoleFilter !== 'all' && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setUserRoleFilter('all')}
                                          className="text-xs"
                                        >
                                          Reset
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {(() => {
                                      const filteredUsers = stats.users?.filter(user => {
                                        const matchesSearch = userSearchQuery === '' ||
                                          user.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                          user.email?.toLowerCase().includes(userSearchQuery.toLowerCase());
                                        const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
                                        return matchesSearch && matchesRole;
                                      }) || [];

                                      return userRoleFilter === 'all'
                                        ? `Showing ${filteredUsers.length} of ${stats.users?.length || 0} users`
                                        : `Showing ${filteredUsers.length} ${userRoleFilter} users`;
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {(() => {
                                const filteredUsers = stats.users?.filter(user => {
                                  const matchesSearch = userSearchQuery === '' ||
                                    user.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                    user.email?.toLowerCase().includes(userSearchQuery.toLowerCase());
                                  const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
                                  return matchesSearch && matchesRole;
                                }) || [];

                                return filteredUsers.length > 0 ? (
                                  filteredUsers.map((user) => (
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
                                        <div className="flex flex-col items-end gap-2">
                                          <div className="text-right text-sm text-gray-500">
                                            <div>Country: {user.country}</div>
                                            <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                          </div>
                                          <div className="flex gap-2">
                                            {!user.isVerified && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => verifyUser(user._id, user.email)}
                                                disabled={isVerifyingUser === user._id}
                                                className="text-xs"
                                              >
                                                {isVerifyingUser === user._id ? (
                                                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                                ) : (
                                                  <UserCheck className="w-3 h-3 mr-1" />
                                                )}
                                                Verify
                                              </Button>
                                            )}
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => deleteUser(user._id, user.email)}
                                              disabled={isDeletingUser === user._id}
                                              className="text-xs"
                                            >
                                              {isDeletingUser === user._id ? (
                                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                              ) : (
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                              )}
                                              Delete
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-8">
                                    <p className="text-gray-500">
                                      {userSearchQuery
                                        ? 'No users found matching your search'
                                        : userRoleFilter === 'all'
                                          ? 'No users found'
                                          : `No ${userRoleFilter} users found`
                                      }
                                    </p>
                                  </div>
                                );
                              })()}
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
                          <CardTitle className="text-blue-800">Active User Trends</CardTitle>
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

                      {/* Session Statistics */}
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardHeader>
                          <CardTitle className="text-purple-800">Session Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-white/50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {stats.sessionData.totalSessions.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Total Sessions</div>
                            </div>
                            <div className="text-center p-4 bg-white/50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {Math.round(stats.sessionData.totalSessionTime / 60).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Total Minutes</div>
                            </div>
                            <div className="text-center p-4 bg-white/50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {Math.round(stats.sessionData.averageSessionTime / 60).toFixed(1)}
                              </div>
                              <div className="text-sm text-gray-600">Avg Session (min)</div>
                            </div>
                            <div className="text-center p-4 bg-white/50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {stats.sessionData.totalPageViews.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Total Page Views</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Payment Statistics */}
                      {stats.paymentStats && (
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                          <CardHeader>
                            <CardTitle className="text-green-800">Payment Statistics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="text-center p-4 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  ₦{stats.paymentStats.totalRevenue?.toLocaleString() || '0'}
                                </div>
                                <div className="text-sm text-gray-600">Total Revenue</div>
                              </div>
                              <div className="text-center p-4 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  {stats.paymentStats.totalPayments || 0}
                                </div>
                                <div className="text-sm text-gray-600">Total Payments</div>
                              </div>
                              <div className="text-center p-4 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  {stats.paymentStats.approvedPayments || 0}
                                </div>
                                <div className="text-sm text-gray-600">Approved</div>
                              </div>
                              <div className="text-center p-4 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">
                                  {stats.paymentStats.pendingPayments || 0}
                                </div>
                                <div className="text-sm text-gray-600">Pending</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {/* Users Tab */}
                  {activeTab === 'users' && (
                    <div className="space-y-6">
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
                                        <div className="flex flex-col items-end gap-2">
                                          <div className="text-right text-sm text-gray-500">
                                            <div>Country: {user.country}</div>
                                            <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                          </div>
                                          <div className="flex gap-2">
                                            {!user.isVerified && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => verifyUser(user._id, user.email)}
                                                disabled={isVerifyingUser === user._id}
                                                className="text-xs"
                                              >
                                                {isVerifyingUser === user._id ? (
                                                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                                ) : (
                                                  <UserCheck className="w-3 h-3 mr-1" />
                                                )}
                                                Verify
                                              </Button>
                                            )}
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => deleteUser(user._id, user.email)}
                                              disabled={isDeletingUser === user._id}
                                              className="text-xs"
                                            >
                                              {isDeletingUser === user._id ? (
                                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                              ) : (
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                              )}
                                              Delete
                                            </Button>
                                          </div>
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
                                        <div className="flex flex-col items-end gap-2">
                                          <div className="text-right text-sm text-gray-500">
                                            <div>Country: {user.country}</div>
                                            <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                          </div>
                                          <div className="flex gap-2">
                                            {!user.isVerified && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => verifyUser(user._id, user.email)}
                                                disabled={isVerifyingUser === user._id}
                                                className="text-xs"
                                              >
                                                {isVerifyingUser === user._id ? (
                                                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                                ) : (
                                                  <UserCheck className="w-3 h-3 mr-1" />
                                                )}
                                                Verify
                                              </Button>
                                            )}
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => deleteUser(user._id, user.email)}
                                              disabled={isDeletingUser === user._id}
                                              className="text-xs"
                                            >
                                              {isDeletingUser === user._id ? (
                                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                              ) : (
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                              )}
                                              Delete
                                            </Button>
                                          </div>
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
                                        <div className="flex flex-col items-end gap-2">
                                          <div className="text-right text-sm text-gray-500">
                                            <div>Country: {user.country}</div>
                                            <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                          </div>
                                          <div className="flex gap-2">
                                            {!user.isVerified && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => verifyUser(user._id, user.email)}
                                                disabled={isVerifyingUser === user._id}
                                                className="text-xs"
                                              >
                                                {isVerifyingUser === user._id ? (
                                                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                                ) : (
                                                  <UserCheck className="w-3 h-3 mr-1" />
                                                )}
                                                Verify
                                              </Button>
                                            )}
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => deleteUser(user._id, user.email)}
                                              disabled={isDeletingUser === user._id}
                                              className="text-xs"
                                            >
                                              {isDeletingUser === user._id ? (
                                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                              ) : (
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                              )}
                                              Delete
                                            </Button>
                                          </div>
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
                                        <div className="flex flex-col items-end gap-2">
                                          <div className="text-right text-sm text-gray-500">
                                            <div>Country: {user.country}</div>
                                            <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                          </div>
                                          <div className="flex gap-2">
                                            {!user.isVerified && (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => verifyUser(user._id, user.email)}
                                                disabled={isVerifyingUser === user._id}
                                                className="text-xs"
                                              >
                                                {isVerifyingUser === user._id ? (
                                                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                                ) : (
                                                  <UserCheck className="w-3 h-3 mr-1" />
                                                )}
                                                Verify
                                              </Button>
                                            )}
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => deleteUser(user._id, user.email)}
                                              disabled={isDeletingUser === user._id}
                                              className="text-xs"
                                            >
                                              {isDeletingUser === user._id ? (
                                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                              ) : (
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                              )}
                                              Delete
                                            </Button>
                                          </div>
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
                    </div>
                  )}

                  {/* Activity Tab */}
                  {activeTab === 'activity' && (
                    <div className="space-y-6">
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
                    </div>
                  )}

                  {/* Sessions Tab */}
                  {activeTab === 'sessions' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
                          <CardHeader>
                            <CardTitle className="text-indigo-800">Session Overview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                <span className="text-sm font-medium text-indigo-700">Total Sessions</span>
                                <span className="text-sm font-bold text-indigo-600">
                                  {stats.sessionData.totalSessions.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                <span className="text-sm font-medium text-indigo-700">Total Time</span>
                                <span className="text-sm font-bold text-indigo-600">
                                  {Math.round(stats.sessionData.totalSessionTime / 60).toLocaleString()} minutes
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                <span className="text-sm font-medium text-indigo-700">Average Session</span>
                                <span className="text-sm font-bold text-indigo-600">
                                  {Math.round(stats.sessionData.averageSessionTime / 60).toFixed(1)} minutes
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                <span className="text-sm font-medium text-indigo-700">Total Page Views</span>
                                <span className="text-sm font-bold text-indigo-600">
                                  {stats.sessionData.totalPageViews.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
                          <CardHeader>
                            <CardTitle className="text-teal-800">User Engagement</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                <span className="text-sm font-medium text-teal-700">Active Users</span>
                                <span className="text-sm font-bold text-teal-600">
                                  {stats.sessionData.activeUsers.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                <span className="text-sm font-medium text-teal-700">Pages per Session</span>
                                <span className="text-sm font-bold text-teal-600">
                                  {stats.sessionData.totalSessions > 0
                                    ? (stats.sessionData.totalPageViews / stats.sessionData.totalSessions).toFixed(1)
                                    : '0'
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                <span className="text-sm font-medium text-teal-700">Engagement Rate</span>
                                <span className="text-sm font-bold text-teal-600">
                                  {stats.totalUsers > 0
                                    ? ((stats.sessionData.activeUsers / stats.totalUsers) * 100).toFixed(1)
                                    : '0'
                                  }%
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                <span className="text-sm font-medium text-teal-700">Avg Time per Page</span>
                                <span className="text-sm font-bold text-teal-600">
                                  {stats.sessionData.totalPageViews > 0
                                    ? Math.round(stats.sessionData.totalSessionTime / stats.sessionData.totalPageViews / 60).toFixed(1)
                                    : '0'
                                  } min
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>Users with Session Data</CardTitle>
                            <Button
                              onClick={() => exportData('userSessions')}
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
                                  <TableHead>User</TableHead>
                                  <TableHead>Total Sessions</TableHead>
                                  <TableHead>Total Time</TableHead>
                                  <TableHead>Avg Session</TableHead>
                                  <TableHead>Total Page Views</TableHead>
                                  <TableHead>Last Session</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {stats.userSessionStats && stats.userSessionStats.length > 0 ? (
                                  stats.userSessionStats.map((userSession) => (
                                    <TableRow key={userSession._id} className="hover:bg-gray-50 cursor-pointer">
                                      <TableCell className="text-sm">
                                        <div>
                                          <div className="font-medium">{userSession.userName}</div>
                                          <div className="text-xs text-gray-500">{userSession.userEmail}</div>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-sm font-medium">
                                        {userSession.totalSessions}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {Math.round(userSession.totalSessionTime / 60)} minutes
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {Math.round(userSession.averageSessionTime / 60).toFixed(1)} minutes
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {userSession.totalPageViews}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {userSession.lastSessionAt ? new Date(userSession.lastSessionAt).toLocaleDateString() : 'Never'}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => viewUserSessions(userSession.userEmail)}
                                          >
                                            View Sessions
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => viewUserPageAnalytics(userSession.userEmail)}
                                          >
                                            Page Analytics
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                      No user session data found. Session data will appear here as users interact with the platform.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Geography Tab */}
                  {activeTab === 'geography' && (
                    <div className="space-y-6">
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
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-purple-800">Review Management</CardTitle>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="bg-purple-600 text-white">
                                {stats.reviews?.filter(r => r.isApproved).length || 0} Approved
                              </Badge>
                              <Badge variant="outline" className="border-purple-600 text-purple-600">
                                {stats.reviews?.filter(r => !r.isApproved).length || 0} Pending
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {stats.reviews && stats.reviews.length > 0 ? (
                              stats.reviews.map((review) => (
                                <div key={review._id} className="p-4 border rounded-lg bg-white/70 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                          <span className="text-purple-600 font-bold">{review.initial}</span>
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-gray-900">{review.name}</h3>
                                          <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                              {[...Array(5)].map((_, i) => (
                                                <Star
                                                  key={i}
                                                  className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"
                                                    } fill-current`}
                                                />
                                              ))}
                                            </div>
                                            <Badge variant={review.isApproved ? "default" : "secondary"} className="text-xs">
                                              {review.isApproved ? "Approved" : "Pending"}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <p className="text-gray-700 mb-2 italic">"{review.quote}"</p>
                                      <p className="text-sm text-gray-600">{review.details}</p>
                                      <div className="text-xs text-gray-500 mt-2">
                                        Submitted: {new Date(review.createdAt).toLocaleDateString()}
                                        {review.approvedAt && (
                                          <span className="ml-4">
                                            Approved: {new Date(review.approvedAt).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                      {!review.isApproved ? (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="default"
                                            onClick={() => approveReview(review._id)}
                                            disabled={isApprovingReview === review._id}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                          >
                                            {isApprovingReview === review._id ? (
                                              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                            ) : (
                                              <UserCheck className="w-3 h-3 mr-1" />
                                            )}
                                            Approve
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => rejectReview(review._id)}
                                            disabled={isRejectingReview === review._id}
                                          >
                                            {isRejectingReview === review._id ? (
                                              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                            ) : (
                                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                              </svg>
                                            )}
                                            Reject
                                          </Button>
                                        </>
                                      ) : (
                                        <Badge variant="default" className="bg-green-600 text-white">
                                          ✓ Approved
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <p>No reviews found.</p>
                                <p className="text-sm mt-2">Reviews will appear here when users submit testimonials.</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Payments Tab */}
                  {activeTab === 'payments' && (
                    <div className="space-y-6">
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-green-800">Payment Management</CardTitle>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setShowPaymentModal(true)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={isAddingPayment}
                              >
                                {isAddingPayment ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Adding Payment...
                                  </>
                                ) : (
                                  'Add Manual Payment'
                                )}
                              </Button>
                              <Button
                                onClick={fixUserAccess}
                                variant="outline"
                                size="sm"
                                disabled={isFixingAccess}
                                className="bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300"
                              >
                                {isFixingAccess ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-2" />
                                    Fixing Access...
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Fix Access
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={() => exportData('payments')}
                                variant="outline"
                                size="sm"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {/* Users List Section */}
                          <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-800">All Users ({users.length})</h3>
                              <Button
                                onClick={() => setShowUserSelectionModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                                disabled={isAddingPayment}
                              >
                                <Users className="w-4 h-4 mr-2" />
                                Add Payment for User
                              </Button>
                            </div>

                            {/* Search Bar */}
                            <div className="mb-4">
                              <div className="flex gap-2 items-center">
                                <Input
                                  type="text"
                                  placeholder="Search users by email or name..."
                                  value={userSearchQuery}
                                  onChange={(e) => setUserSearchQuery(e.target.value)}
                                  className="max-w-md"
                                />
                                {userSearchQuery && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setUserSearchQuery('')}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    Clear
                                  </Button>
                                )}
                              </div>
                              {userSearchQuery && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Showing {filteredUsers.length} of {users.length} users
                                </p>
                              )}
                            </div>

                            {isLoadingUsers ? (
                              <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <p className="text-gray-600 text-sm">Loading users...</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredUsers && filteredUsers.length > 0 ? (
                                  filteredUsers.map((user) => (
                                    <div key={user._id} className="p-4 border rounded-lg bg-white/70 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                      onClick={() => handleUserSelection(user)}>
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                          <span className="text-blue-600 font-bold text-sm">
                                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-gray-900 truncate">
                                            {user.name || 'No Name'}
                                          </h4>
                                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            {user.access?.premium && (
                                              <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                                                ⭐ Premium
                                              </Badge>
                                            )}
                                            <Badge variant="outline" className="text-xs">
                                              {user.access?.ielts ? 'IELTS' : 'No IELTS'}
                                            </Badge>
                                            {user.access?.flashcards && (
                                              <Badge variant="outline" className="text-xs text-purple-600">
                                                Flashcards
                                              </Badge>
                                            )}
                                            {user.access?.aiTutor && (
                                              <Badge variant="outline" className="text-xs text-green-600">
                                                AI Tutor
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="col-span-full text-center py-8 text-gray-500">
                                    {userSearchQuery ? 'No users found matching your search' : 'No users found'}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Payments List Section */}
                          <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Records</h3>
                            {isLoadingPayments ? (
                              <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading payments...</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {payments && payments.length > 0 ? (
                                  payments.map((payment) => (
                                    <div key={payment._id} className="p-4 border rounded-lg bg-white/70 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                              <span className="text-green-600 font-bold">$</span>
                                            </div>
                                            <div>
                                              <h3 className="font-semibold text-gray-900">{payment.userName || payment.userEmail}</h3>
                                              <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                  {payment.package}
                                                </Badge>
                                                <Badge variant={payment.status === 'approved' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                                                  {payment.status}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                  {payment.paymentMethod}
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            <p><strong>Amount:</strong> ${payment.amount?.toLocaleString()}</p>
                                            <p><strong>Package:</strong> {payment.package} - {payment.duration} days</p>
                                            <p><strong>Payment Date:</strong> {new Date(payment.paymentDate).toLocaleDateString()}</p>
                                            <p><strong>Expires:</strong> {payment.expiresAt ? new Date(payment.expiresAt).toLocaleDateString() : 'N/A'}</p>
                                            {payment.transactionId && <p><strong>Transaction ID:</strong> {payment.transactionId}</p>}
                                            {payment.notes && <p><strong>Notes:</strong> {payment.notes}</p>}
                                          </div>
                                        </div>
                                        <div className="flex flex-col gap-2 ml-4">
                                          {payment.status === 'pending' && (
                                            <>
                                              <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() => processPayment(payment._id, 'approve')}
                                                disabled={isProcessingPayment === payment._id}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                              >
                                                {isProcessingPayment === payment._id ? (
                                                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                                ) : (
                                                  <UserCheck className="w-3 h-3 mr-1" />
                                                )}
                                                Approve
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => processPayment(payment._id, 'reject')}
                                                disabled={isProcessingPayment === payment._id}
                                              >
                                                {isProcessingPayment === payment._id ? (
                                                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
                                                ) : (
                                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                  </svg>
                                                )}
                                                Reject
                                              </Button>
                                            </>
                                          )}
                                          {payment.status === 'approved' && (
                                            <Badge variant="default" className="bg-green-600 text-white">
                                              ✓ Approved
                                            </Badge>
                                          )}
                                          {payment.status === 'rejected' && (
                                            <Badge variant="destructive">
                                              ✗ Rejected
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>No payments found.</p>
                                    <p className="text-sm mt-2">Payments will appear here when users make payments or you add them manually.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Alerts Tab */}
                  {activeTab === 'alerts' && (
                    <div className="space-y-6">
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-indigo-800">Alert Management</CardTitle>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setShowCreateAlertModal(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                disabled={isCreatingAlert}
                              >
                                {isCreatingAlert ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating Alert...
                                  </>
                                ) : (
                                  'Create New Alert'
                                )}
                              </Button>
                              <Button
                                onClick={fetchAlerts}
                                variant="outline"
                                size="sm"
                                disabled={isLoadingAlerts}
                              >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingAlerts ? 'animate-spin' : ''}`} />
                                Refresh
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {isLoadingAlerts ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                              <p className="text-gray-600">Loading alerts...</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {alerts && alerts.length > 0 ? (
                                alerts.map((alert) => (
                                  <div key={alert._id} className="p-4 border rounded-lg bg-white/70 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 font-bold">!</span>
                                          </div>
                                          <div>
                                            <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                                            <div className="flex items-center gap-2">
                                              <Badge variant="outline" className="text-xs">
                                                {alert.type}
                                              </Badge>
                                              <Badge variant={alert.isActive ? "default" : "secondary"} className="text-xs">
                                                {alert.isActive ? "Active" : "Inactive"}
                                              </Badge>
                                              {alert.showOnce && (
                                                <Badge variant="outline" className="text-xs">
                                                  Show Once
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          <p><strong>Message:</strong> {alert.message}</p>
                                          <p><strong>Button Text:</strong> {alert.buttonText}</p>
                                          <p><strong>Action:</strong> {alert.buttonAction}</p>
                                          <p><strong>Created:</strong> {new Date(alert.createdAt).toLocaleDateString()}</p>
                                          {alert.expiresAt && (
                                            <p><strong>Expires:</strong> {new Date(alert.expiresAt).toLocaleDateString()}</p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-2 ml-4">
                                        <Button
                                          size="sm"
                                          variant={alert.isActive ? "outline" : "default"}
                                          onClick={() => toggleAlert(alert._id, !alert.isActive)}
                                          className={alert.isActive ? "text-red-600 border-red-600 hover:bg-red-50" : "bg-green-600 hover:bg-green-700 text-white"}
                                        >
                                          {alert.isActive ? 'Deactivate' : 'Activate'}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => deleteAlert(alert._id)}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <p>No alerts found.</p>
                                  <p className="text-sm mt-2">Create your first alert to start engaging with users.</p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Calculator Analytics Tab */}
                  {activeTab === 'calculator' && (
                    <div className="space-y-6">
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-blue-50">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-emerald-800 flex items-center gap-2">
                              <Calculator className="w-5 h-5" />
                              Calculator Analytics
                            </CardTitle>
                            <Button
                              onClick={fetchCalculatorAnalytics}
                              variant="outline"
                              size="sm"
                              disabled={isLoadingCalculatorAnalytics}
                            >
                              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingCalculatorAnalytics ? 'animate-spin' : ''}`} />
                              Refresh
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {isLoadingCalculatorAnalytics ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                              <p className="text-gray-600">Loading calculator analytics...</p>
                            </div>
                          ) : calculatorAnalytics !== null ? (
                            <div className="space-y-6">
                              {/* Overview Stats */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-white">
                                  <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-sm font-medium text-gray-600">Total Usage</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                          {calculatorAnalytics.totalUsage?.toLocaleString() || 0}
                                        </p>
                                      </div>
                                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Calculator className="w-6 h-6 text-emerald-600" />
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card className="bg-white">
                                  <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-sm font-medium text-gray-600">Unique Users</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">
                                          {calculatorAnalytics.uniqueUsers?.toLocaleString() || 0}
                                        </p>
                                      </div>
                                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-blue-600" />
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Usage by Calculator Type */}
                              {calculatorAnalytics.usageByType && calculatorAnalytics.usageByType.length > 0 ? (
                                <Card className="bg-white">
                                  <CardHeader>
                                    <CardTitle className="text-lg">Usage by Calculator Type</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      {calculatorAnalytics.usageByType.map((type: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                          <div className="flex-1">
                                            <p className="font-medium text-gray-900 capitalize">
                                              {type.calculatorType || 'General'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              {type.uniqueUsers || 0} unique users
                                            </p>
                                          </div>
                                          <Badge variant="secondary" className="text-lg font-semibold">
                                            {type.count?.toLocaleString() || 0}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ) : null}

                              {/* Most Active Users */}
                              {calculatorAnalytics.mostActiveUsers && calculatorAnalytics.mostActiveUsers.length > 0 && (
                                <Card className="bg-white">
                                  <CardHeader>
                                    <CardTitle className="text-lg">Most Active Users</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>User</TableHead>
                                          <TableHead>Usage Count</TableHead>
                                          <TableHead>Last Used</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {calculatorAnalytics.mostActiveUsers.map((user: any, index: number) => (
                                          <TableRow key={index}>
                                            <TableCell>
                                              <div>
                                                <p className="font-medium">{user.userName || user.userEmail}</p>
                                                <p className="text-sm text-gray-500">{user.userEmail}</p>
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              <Badge variant="secondary">{user.count}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                              {user.lastUsed ? new Date(user.lastUsed).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Recent Usage */}
                              {calculatorAnalytics.recentUsage && calculatorAnalytics.recentUsage.length > 0 && (
                                <Card className="bg-white">
                                  <CardHeader>
                                    <CardTitle className="text-lg">Recent Usage</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                      {calculatorAnalytics.recentUsage.map((usage: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                          <div className="flex-1">
                                            <p className="font-medium text-gray-900">{usage.userName || usage.userEmail}</p>
                                            <p className="text-sm text-gray-600 capitalize">
                                              {usage.calculatorType || 'general'} calculator
                                            </p>
                                          </div>
                                          <p className="text-sm text-gray-500">
                                            {new Date(usage.timestamp).toLocaleString()}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              {(!calculatorAnalytics.totalUsage || calculatorAnalytics.totalUsage === 0) && (
                                <div className="text-center py-12 text-gray-500">
                                  <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                  <p>No calculator usage data available yet.</p>
                                  <p className="text-sm mt-2">Usage data will appear here once users start using the calculator.</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <p>Failed to load calculator analytics.</p>
                              <Button onClick={fetchCalculatorAnalytics} className="mt-4">
                                Try Again
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Emails Tab */}
                  {activeTab === 'emails' && (
                    <div className="space-y-6">
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-blue-800">Email Notifications</CardTitle>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="bg-blue-600 text-white">
                                {emailFormData.selectedUsers.length}/50 Selected
                              </Badge>
                              <Button
                                onClick={fetchEmailRecipients}
                                variant="outline"
                                size="sm"
                                disabled={isLoadingEmailRecipients}
                              >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingEmailRecipients ? 'animate-spin' : ''}`} />
                                Refresh Users
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {/* Email Composition Form */}
                          <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Compose Email</h3>
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              if (emailFormData.selectedUsers.length === 0) {
                                toast({
                                  title: "No Recipients",
                                  description: "Please select at least one user to send emails to.",
                                  variant: "destructive",
                                });
                                return;
                              }
                              sendEmails(emailFormData);
                            }} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="emailSubject">Subject *</Label>
                                  <Input
                                    id="emailSubject"
                                    value={emailFormData.subject}
                                    onChange={(e) => setEmailFormData(prev => ({ ...prev, subject: e.target.value }))}
                                    required
                                    placeholder="Enter email subject"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="emailTemplate">Template</Label>
                                  <Select value={emailFormData.template} onValueChange={(value) => setEmailFormData(prev => ({ ...prev, template: value }))}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="feature_update">Feature Update</SelectItem>
                                      <SelectItem value="announcement">Announcement</SelectItem>
                                      <SelectItem value="promotion">Promotion</SelectItem>
                                      <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="emailMessage">Message *</Label>
                                <Textarea
                                  id="emailMessage"
                                  value={emailFormData.message}
                                  onChange={(e) => setEmailFormData(prev => ({ ...prev, message: e.target.value }))}
                                  required
                                  placeholder="Enter your email message here..."
                                  rows={6}
                                  className="resize-none"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="productName">Product/Feature Name</Label>
                                  <Input
                                    id="productName"
                                    value={emailFormData.productName}
                                    onChange={(e) => setEmailFormData(prev => ({ ...prev, productName: e.target.value }))}
                                    placeholder="e.g., Scientific Calculator, Exam Prep, Flashcards"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="productLink">Direct Link to Product</Label>
                                  <Input
                                    id="productLink"
                                    value={emailFormData.productLink}
                                    onChange={(e) => setEmailFormData(prev => ({ ...prev, productLink: e.target.value }))}
                                    placeholder="e.g., https://groupxam.com/calculator"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={clearAllUsers}
                                  disabled={emailFormData.selectedUsers.length === 0}
                                >
                                  Clear Selection
                                </Button>
                                <Button
                                  type="submit"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  disabled={isSendingEmails || emailFormData.selectedUsers.length === 0}
                                >
                                  {isSendingEmails ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                      Sending Emails...
                                    </>
                                  ) : (
                                    `Send to ${emailFormData.selectedUsers.length} Users`
                                  )}
                                </Button>
                              </div>
                            </form>
                          </div>

                          {/* User Selection Section */}
                          <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-800">Select Recipients (Max 50)</h3>
                              <div className="flex gap-2">
                                <Button
                                  onClick={selectAllUsers}
                                  variant="outline"
                                  size="sm"
                                  disabled={isLoadingEmailRecipients}
                                >
                                  Select All (Max 50)
                                </Button>
                                <Button
                                  onClick={clearAllUsers}
                                  variant="outline"
                                  size="sm"
                                  disabled={emailFormData.selectedUsers.length === 0}
                                >
                                  Clear All
                                </Button>
                              </div>
                            </div>

                            {/* Search and Filter */}
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex flex-col gap-4">
                                {/* Search Bar */}
                                <div>
                                  <label className="text-sm font-medium text-gray-700 mb-2 block">Search Users</label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="text"
                                      placeholder="Search by name or email..."
                                      value={emailSearchQuery}
                                      onChange={(e) => setEmailSearchQuery(e.target.value)}
                                      className="flex-1"
                                    />
                                    {emailSearchQuery && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEmailSearchQuery('')}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        Clear
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {/* Role Filter */}
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                  <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Role</label>
                                    <div className="flex gap-2">
                                      <Select value={emailUserRoleFilter} onValueChange={setEmailUserRoleFilter}>
                                        <SelectTrigger className="w-full sm:w-48">
                                          <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="all">All Users</SelectItem>
                                          <SelectItem value="student">Students</SelectItem>
                                          <SelectItem value="university">Universities</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      {emailUserRoleFilter !== 'all' && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setEmailUserRoleFilter('all')}
                                          className="text-xs"
                                        >
                                          Reset
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {(() => {
                                      const filteredUsers = getFilteredEmailRecipients();
                                      return emailUserRoleFilter === 'all'
                                        ? `Showing ${filteredUsers.length} of ${emailRecipients.length} users`
                                        : `Showing ${filteredUsers.length} ${emailUserRoleFilter} users`;
                                    })()}
                                  </div>
                                </div>

                                {/* Range Selection */}
                                <div className="border-t pt-4">
                                  <div className="flex items-center gap-4 mb-3">
                                    <label className="text-sm font-medium text-gray-700">Quick Selection:</label>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => selectUsersByCount(10)}
                                        disabled={getFilteredEmailRecipients().length < 10}
                                      >
                                        First 10
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => selectUsersByCount(25)}
                                        disabled={getFilteredEmailRecipients().length < 25}
                                      >
                                        First 25
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => selectUsersByCount(50)}
                                        disabled={getFilteredEmailRecipients().length < 50}
                                      >
                                        First 50
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700">Custom Range:</label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        placeholder="Start"
                                        value={rangeSelection.startRange}
                                        onChange={(e) => setRangeSelection(prev => ({ ...prev, startRange: e.target.value }))}
                                        className="w-20"
                                        min="1"
                                      />
                                      <span className="text-gray-500">to</span>
                                      <Input
                                        type="number"
                                        placeholder="End"
                                        value={rangeSelection.endRange}
                                        onChange={(e) => setRangeSelection(prev => ({ ...prev, endRange: e.target.value }))}
                                        className="w-20"
                                        min="1"
                                      />
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={selectUsersByRange}
                                        disabled={!rangeSelection.startRange || !rangeSelection.endRange}
                                      >
                                        Select Range
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-2">
                                    Examples: 1-10, 100-115, 200-250 (max 50 users per range)
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Users List */}
                            {isLoadingEmailRecipients ? (
                              <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading users...</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                                {getFilteredEmailRecipients().map((user) => {
                                  const isSelected = emailFormData.selectedUsers.includes(user._id);
                                  const isDisabled = !isSelected && emailFormData.selectedUsers.length >= 50;

                                  return (
                                    <div
                                      key={user._id}
                                      className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected
                                        ? 'bg-blue-100 border-blue-300 shadow-md'
                                        : isDisabled
                                          ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                                          : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                                        }`}
                                      onClick={() => !isDisabled && handleEmailUserSelection(user._id, !isSelected)}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-500' : 'bg-gray-200'
                                          }`}>
                                          <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-600'
                                            }`}>
                                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                          </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-gray-900 truncate">
                                            {user.name || 'No Name'}
                                          </h4>
                                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <Badge variant="outline" className="text-xs">
                                              {user.role}
                                            </Badge>
                                            {user.access?.premium && (
                                              <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                                                ⭐ Premium
                                              </Badge>
                                            )}
                                            {isSelected && (
                                              <Badge className="text-xs bg-blue-600 text-white">
                                                ✓ Selected
                                              </Badge>
                                            )}
                                            {isDisabled && !isSelected && (
                                              <Badge variant="outline" className="text-xs text-gray-500">
                                                Limit Reached
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {getFilteredEmailRecipients().length === 0 && !isLoadingEmailRecipients && (
                              <div className="text-center py-8 text-gray-500">
                                <p>No users found matching your criteria.</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeTab === 'maintenance' && (
                    <div className="space-y-6">
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-amber-800">Maintenance Controls</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-amber-500/20 text-amber-700">
                                {activeMaintenanceCount} active
                              </Badge>
                              <Button
                                onClick={fetchMaintenanceSettings}
                                variant="outline"
                                size="sm"
                                disabled={isLoadingMaintenance}
                                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                              >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingMaintenance ? 'animate-spin' : ''}`} />
                                Refresh
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-amber-700 leading-relaxed">
                            Toggle maintenance mode for specific sections or the entire site. When enabled, visitors will see a courtesy message and access will be temporarily paused.
                          </p>
                        </CardContent>
                      </Card>

                      {isLoadingMaintenance ? (
                        <div className="text-center py-12">
                          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-amber-500"></div>
                          <p className="text-amber-700">Loading maintenance settings...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {MAINTENANCE_SECTIONS.map((section) => {
                            const setting = maintenanceSettings[section.id];
                            const isActive = setting?.isActive ?? false;
                            const updatedAt = setting?.updatedAt ? new Date(setting.updatedAt) : null;
                            const messageDraft = maintenanceDrafts[section.id] ?? section.defaultMessage;

                            return (
                              <Card
                                key={section.id}
                                className={`bg-white border ${isActive ? 'border-amber-300 shadow-[0_20px_40px_-25px_rgba(217,119,6,0.6)]' : 'border-gray-100 shadow-lg'}`}
                              >
                                <CardHeader>
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <CardTitle className="text-base font-semibold text-gray-900">{section.label}</CardTitle>
                                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">{section.description}</p>
                                    </div>
                                    <Badge
                                      variant={isActive ? 'destructive' : 'outline'}
                                      className={isActive ? 'bg-amber-100 text-amber-700 border-amber-200' : ''}
                                    >
                                      {isActive ? 'Maintenance On' : 'Live'}
                                    </Badge>
                                  </div>
                                  {updatedAt && (
                                    <p className="mt-2 text-xs text-gray-500">
                                      Updated {updatedAt.toLocaleString()}
                                      {setting?.updatedBy ? ` by ${setting.updatedBy}` : ''}
                                    </p>
                                  )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Maintenance Message</Label>
                                    <Textarea
                                      value={messageDraft}
                                      onChange={(event) =>
                                        setMaintenanceDrafts((prev) => ({ ...prev, [section.id]: event.target.value }))
                                      }
                                      rows={4}
                                      disabled={savingMaintenance === section.id}
                                      className="resize-none"
                                      placeholder={section.defaultMessage}
                                    />
                                  </div>

                                  <div className="flex flex-wrap justify-end gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      disabled={savingMaintenance === section.id}
                                      onClick={() => {
                                        const defaultMessage = section.defaultMessage;
                                        setMaintenanceDrafts((prev) => ({ ...prev, [section.id]: defaultMessage }));
                                        handleMaintenanceUpdate(section.id, { message: defaultMessage });
                                      }}
                                    >
                                      Reset to Default
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      disabled={savingMaintenance === section.id}
                                      onClick={() => handleMaintenanceUpdate(section.id, { message: messageDraft })}
                                    >
                                      {savingMaintenance === section.id ? (
                                        <>
                                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                        </>
                                      ) : (
                                        <>
                                          <RefreshCw className="mr-2 h-4 w-4" /> Save Message
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      type="button"
                                      className={isActive ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}
                                      disabled={savingMaintenance === section.id}
                                      onClick={() =>
                                        handleMaintenanceUpdate(section.id, {
                                          isActive: !isActive,
                                          message: messageDraft,
                                        })
                                      }
                                    >
                                      {isActive ? 'Disable Maintenance' : 'Enable Maintenance'}
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
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

      {/* User Sessions Modal */}
      <Dialog open={showUserSessionsModal} onOpenChange={setShowUserSessionsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session History for {selectedUserEmail}</DialogTitle>
            <DialogDescription>
              Detailed session history for this user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedUserSessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Page Views</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedUserSessions.map((session) => (
                    <TableRow key={session._id}>
                      <TableCell className="text-sm">
                        {session.endTime ? new Date(session.endTime).toLocaleString() : 'Invalid Date'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {Math.round(session.sessionDuration / 60)} minutes
                      </TableCell>
                      <TableCell className="text-sm">
                        {session.pageViews || 0}
                      </TableCell>
                      <TableCell className="text-sm">
                        {session.actions ? session.actions.length : 0}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewSessionDetails(session)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No session data found for this user.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Details Modal */}
      <Dialog open={showSessionDetailsModal} onOpenChange={setShowSessionDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>
              Detailed page visit information for this session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSession && (
              <>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-700">Session Overview</h3>
                    <div className="text-sm text-gray-600 mt-2">
                      <p><strong>Start Time:</strong> {selectedSession.startTime ? new Date(selectedSession.startTime).toLocaleString() : 'N/A'}</p>
                      <p><strong>End Time:</strong> {selectedSession.endTime ? new Date(selectedSession.endTime).toLocaleString() : 'N/A'}</p>
                      <p><strong>Duration:</strong> {Math.round(selectedSession.sessionDuration / 60)} minutes</p>
                      <p><strong>Status:</strong> {selectedSession.status}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Activity Summary</h3>
                    <div className="text-sm text-gray-600 mt-2">
                      <p><strong>Page Views:</strong> {selectedSession.pageViews || 0}</p>
                      <p><strong>Total Actions:</strong> {selectedSession.actions ? selectedSession.actions.length : 0}</p>
                      <p><strong>User Agent:</strong> {selectedSession.userAgent ? selectedSession.userAgent.substring(0, 50) + '...' : 'N/A'}</p>
                      <p><strong>Referrer:</strong> {selectedSession.referrer || 'Direct'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Page Visit Details</h3>
                  {selectedSession.pageVisits && selectedSession.pageVisits.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Page</TableHead>
                          <TableHead>Time Spent</TableHead>
                          <TableHead>Actions</TableHead>
                          <TableHead>Entry Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSession.pageVisits.map((visit: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="text-sm">
                              <div>
                                <div className="font-medium">{visit.page || 'Unknown Page'}</div>
                                <div className="text-xs text-gray-500">{visit.url || 'N/A'}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatPageVisitDuration(visit.duration)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {visit.actions ? visit.actions.length : 0}
                            </TableCell>
                            <TableCell className="text-sm">
                              {visit.entryTime ? new Date(visit.entryTime).toLocaleTimeString() : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No detailed page visit data available for this session.</p>
                      <p className="text-sm mt-2">Page visit tracking will be available in future updates.</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">User Actions</h3>
                  {selectedSession.actions && selectedSession.actions.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {selectedSession.actions.map((action: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No user actions recorded for this session.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Page Analytics Modal */}
      <Dialog open={showPageAnalyticsModal} onOpenChange={setShowPageAnalyticsModal}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Page Analytics{selectedUserEmail ? ` - ${selectedUserEmail}` : ''}</DialogTitle>
            <DialogDescription>
              {selectedUserEmail
                ? `Time spent on each page for ${selectedUserEmail}`
                : 'Time spent on each page across all sessions'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {pageAnalytics.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-blue-800">Total Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-700">
                        {pageAnalytics.length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-green-800">Total Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-700">
                        {formatSessionDuration(pageAnalytics.reduce((sum, page) => sum + page.totalTime, 0))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-purple-800">Avg Time per Page</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-700">
                        {pageAnalytics.length > 0 ? formatSessionDuration(Math.round(pageAnalytics.reduce((sum, page) => sum + page.totalTime, 0) / pageAnalytics.length)) : '0 minutes'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Total Time</TableHead>
                      <TableHead>Visits</TableHead>
                      <TableHead>Avg Time per Visit</TableHead>
                      <TableHead>Total Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageAnalytics.map((page, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm">
                          <div>
                            <div className="font-medium">{page.pageName}</div>
                            <div className="text-xs text-gray-500">{page.page}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="max-w-xs truncate" title={page.url}>
                            {page.url}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {formatSessionDuration(page.totalTime)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {page.visits}
                        </TableCell>
                        <TableCell className="text-sm">
                          {page.visits > 0 ? formatSessionDuration(Math.round(page.totalTime / page.visits)) : '0 minutes'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {page.totalActions}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No page analytics data available.</p>
                <p className="text-sm mt-2">Page visit tracking will populate this data as users interact with the platform.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Manual Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Manual Payment</DialogTitle>
            <DialogDescription>
              Add a payment record for a user who has paid directly to your account
            </DialogDescription>
          </DialogHeader>
          <AddManualPaymentForm
            onSubmit={addManualPayment}
            onCancel={() => setShowPaymentModal(false)}
            formData={formData}
            setFormData={setFormData}
            isLoading={isAddingPayment}
          />
        </DialogContent>
      </Dialog>

      {/* User Selection Modal */}
      <Dialog open={showUserSelectionModal} onOpenChange={setShowUserSelectionModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select User for Payment</DialogTitle>
            <DialogDescription>
              Choose a user to add a payment record for
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {/* Search Bar in Modal */}
            <div className="mb-4 sticky top-0 bg-white z-10 pb-2">
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Search users by email or name..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="flex-1"
                />
                {userSearchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserSearchQuery('')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </Button>
                )}
              </div>
              {userSearchQuery && (
                <p className="text-sm text-gray-600 mt-1">
                  Showing {filteredUsers.length} of {users.length} users
                </p>
              )}
            </div>

            {isLoadingUsers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user._id}
                      className="p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleUserSelection(user)}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {user.name || 'No Name'}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {user.access?.premium && (
                              <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                                ⭐ Premium
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {user.access?.ielts ? 'IELTS' : 'No IELTS'}
                            </Badge>
                            {user.access?.flashcards && (
                              <Badge variant="outline" className="text-xs text-purple-600">
                                Flashcards
                              </Badge>
                            )}
                            {user.access?.aiTutor && (
                              <Badge variant="outline" className="text-xs text-green-600">
                                AI Tutor
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    {userSearchQuery ? 'No users found matching your search' : 'No users found'}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowUserSelectionModal(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Alert Modal */}
      <Dialog open={showCreateAlertModal} onOpenChange={setShowCreateAlertModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Alert</DialogTitle>
            <DialogDescription>
              Create a popup alert that will be shown to users
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            createAlert(alertFormData);
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Alert Type *</Label>
                <Select value={alertFormData.type} onValueChange={(value) => setAlertFormData({ ...alertFormData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="testimonial">Testimonial Request</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Alert Title *</Label>
              <Input
                id="title"
                value={alertFormData.title}
                onChange={(e) => setAlertFormData({ ...alertFormData, title: e.target.value })}
                required
                placeholder="Enter alert title"
              />
            </div>

            <div>
              <Label htmlFor="message">Alert Message *</Label>
              <Textarea
                id="message"
                value={alertFormData.message}
                onChange={(e) => setAlertFormData({ ...alertFormData, message: e.target.value })}
                required
                placeholder="Enter alert message"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buttonText">Button Text *</Label>
                <Input
                  id="buttonText"
                  value={alertFormData.buttonText}
                  onChange={(e) => setAlertFormData({ ...alertFormData, buttonText: e.target.value })}
                  required
                  placeholder="e.g., Leave Testimonial"
                />
              </div>
              <div>
                <Label htmlFor="buttonAction">Button Action *</Label>
                <Select value={alertFormData.buttonAction} onValueChange={(value) => setAlertFormData({ ...alertFormData, buttonAction: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open_testimonial">Open Testimonial Form</SelectItem>
                    <SelectItem value="redirect_to_page">Redirect to Page</SelectItem>
                    <SelectItem value="close_alert">Just Close Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={alertFormData.expiresAt}
                onChange={(e) => setAlertFormData({ ...alertFormData, expiresAt: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={alertFormData.isActive}
                onChange={(e) => setAlertFormData({ ...alertFormData, isActive: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isActive">Activate alert immediately</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showOnce"
                checked={alertFormData.showOnce}
                onChange={(e) => setAlertFormData({ ...alertFormData, showOnce: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="showOnce">Show only once per user</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowCreateAlertModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isCreatingAlert}
              >
                {isCreatingAlert ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Alert...
                  </>
                ) : (
                  'Create Alert'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
} 