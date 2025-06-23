import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Calendar, Download, ArrowLeft, Clock, MapPin, User, UserPlus, Filter, FileType, Search, Info, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Mock analytics data
const revenueData = [
  { month: 'Jan', revenue: 12400, students: 45, coaches: 8 },
  { month: 'Feb', revenue: 13200, students: 52, coaches: 9 },
  { month: 'Mar', revenue: 14800, students: 58, coaches: 10 },
  { month: 'Apr', revenue: 16200, students: 64, coaches: 11 },
  { month: 'May', revenue: 17500, students: 68, coaches: 12 },
  { month: 'Jun', revenue: 18900, students: 72, coaches: 12 }
];

// Coach form validation schema
const coachFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  sport: z.string().min(1, { message: "Please select a sport." }),
  experience: z.string().min(1, { message: "Please enter experience in years." }),
  qualifications: z.string().min(5, { message: "Please enter qualifications (minimum 5 characters)." }),
  salary: z.string().min(1, { message: "Please enter salary amount." })
});

type CoachFormValues = z.infer<typeof coachFormSchema>;

const sportDistribution = [
  { sport: 'Soccer', students: 28, revenue: 8400, color: '#ef4444' },
  { sport: 'Basketball', students: 22, revenue: 6600, color: '#3b82f6' },
  { sport: 'Tennis', students: 15, revenue: 4500, color: '#10b981' },
  { sport: 'Swimming', students: 18, revenue: 5400, color: '#f59e0b' }
];

const paymentTrends = [
  { month: 'Jan', successful: 85, not_paid: 8, pending: 7 },
  { month: 'Feb', successful: 88, not_paid: 6, pending: 6 },
  { month: 'Mar', successful: 92, not_paid: 4, pending: 4 },
  { month: 'Apr', successful: 89, not_paid: 7, pending: 4 },
  { month: 'May', successful: 94, not_paid: 3, pending: 3 },
  { month: 'Jun', successful: 96, not_paid: 2, pending: 2 }
];

// Extended coach performance data (40 coaches)
const coachPerformance = [
  { id: 1, name: 'Coach Michael', students: 28, retention: 95, rating: 4.8, sport: 'Soccer' },
  { id: 2, name: 'Coach Sarah', students: 22, retention: 92, rating: 4.7, sport: 'Basketball' },
  { id: 3, name: 'Coach David', students: 15, retention: 88, rating: 4.6, sport: 'Tennis' },
  { id: 4, name: 'Coach Lisa', students: 18, retention: 94, rating: 4.9, sport: 'Swimming' },
  { id: 5, name: 'Coach James', students: 25, retention: 90, rating: 4.5, sport: 'Soccer' },
  // More coaches...
];

const attendanceData = [
  { date: '2024-01-01', present: 65, absent: 8, late: 4 },
  { date: '2024-01-02', present: 68, absent: 6, late: 3 },
  { date: '2024-01-03', present: 71, absent: 4, late: 2 },
  { date: '2024-01-04', present: 69, absent: 5, late: 3 },
  { date: '2024-01-05', present: 72, absent: 3, late: 2 },
  { date: '2024-01-06', present: 70, absent: 4, late: 3 },
  { date: '2024-01-07', present: 73, absent: 2, late: 2 }
];

// Mock coach attendance data
const coachAttendanceData = [
  { date: '2024-01-01', present: 35, absent: 3, late: 2 },
  { date: '2024-01-02', present: 37, absent: 2, late: 1 },
  { date: '2024-01-03', present: 36, absent: 3, late: 1 },
  { date: '2024-01-04', present: 38, absent: 1, late: 1 },
  { date: '2024-01-05', present: 39, absent: 1, late: 0 },
  { date: '2024-01-06', present: 37, absent: 2, late: 1 },
  { date: '2024-01-07', present: 38, absent: 1, late: 1 }
];

// Generate detailed student attendance
const generateStudentAttendance = () => {
  const students = [];
  const sports = ['Soccer', 'Basketball', 'Tennis', 'Swimming'];
  const firstNames = ['John', 'Sarah', 'Mike', 'Emma', 'Alex', 'Lisa', 'David', 'Sophie', 'Ryan', 'Anna'];
  const lastNames = ['Smith', 'Johnson', 'Davis', 'Wilson', 'Brown', 'Chen', 'Garcia', 'Miller', 'Taylor', 'Anderson'];
  
  for (let i = 0; i < 40; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const present = Math.floor(Math.random() * 3) + 5; // 5-7 days
    const absent = Math.floor(Math.random() * 3); // 0-2 days
    const late = Math.floor(Math.random() * 2); // 0-1 days
    const total = present + absent + late;
    const attendanceRate = Math.round((present / total) * 100);
    
    students.push({
      name: `${firstName} ${lastName}`,
      sport: sports[i % sports.length],
      present,
      absent,
      late,
      attendanceRate
    });
  }
  return students;
};

// Generate detailed coach attendance
const generateCoachAttendance = () => {
  const coaches = [];
  const sports = ['Soccer', 'Basketball', 'Tennis', 'Swimming'];
  
  for (let i = 0; i < coachPerformance.length; i++) {
    const present = Math.floor(Math.random() * 2) + 6; // 6-7 days
    const absent = Math.floor(Math.random() * 2); // 0-1 days
    const late = Math.floor(Math.random() * 2); // 0-1 days
    const total = present + absent + late;
    const attendanceRate = Math.round((present / total) * 100);
    const avgHours = (Math.random() * 2 + 7).toFixed(1); // 7.0-9.0 hours
    
    coaches.push({
      name: coachPerformance[i]?.name || `Coach ${i + 1}`,
      sport: sports[i % sports.length],
      present,
      absent,
      late,
      attendanceRate,
      avgHours: parseFloat(avgHours)
    });
  }
  return coaches;
};

const studentAttendanceDetails = generateStudentAttendance();
const coachAttendanceDetails = generateCoachAttendance();

const chartConfig = {
  revenue: { label: 'Revenue', color: '#ef4444' },
  students: { label: 'Students', color: '#3b82f6' },
  coaches: { label: 'Coaches', color: '#10b981' },
  present: { label: 'Present', color: '#10b981' },
  absent: { label: 'Absent', color: '#ef4444' },
  late: { label: 'Late', color: '#f59e0b' },
  successful: { label: 'Successful', color: '#10b981' },
  not_paid: { label: 'Not Paid', color: '#ef4444' },
  pending: { label: 'Pending', color: '#f59e0b' }
};

interface AdminAnalyticsProps {
  onBack?: () => void;
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ onBack }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [attendanceView, setAttendanceView] = React.useState<'student' | 'coach'>('student');
  const [showCoachManagement, setShowCoachManagement] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [selectedDateRange, setSelectedDateRange] = React.useState<'week' | 'month' | 'quarter' | 'year'>('month');  const [exportFormat, setExportFormat] = React.useState<'pdf' | 'csv'>('pdf');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddCoachDialogOpen, setIsAddCoachDialogOpen] = React.useState(false);
  
  // Form for adding new coach
  const form = useForm<CoachFormValues>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      sport: "",
      experience: "",
      qualifications: "",
      salary: ""
    }
  });
  
  React.useEffect(() => {
    if (isMobile) {
      navigate('/admin/dashboard');
    }
  }, [isMobile, navigate]);

  // Simulate data loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Derived metrics calculation
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalStudents = Math.max(...revenueData.map(item => item.students));
  const revenueGrowth = ((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue * 100).toFixed(1);
  const avgAttendance = ((attendanceData.reduce((sum, item) => sum + item.present, 0) / attendanceData.length) / (attendanceData[0].present + attendanceData[0].absent + attendanceData[0].late) * 100).toFixed(1);
  const totalCoaches = coachPerformance.length;
  const avgCoachRating = (coachPerformance.reduce((sum, coach) => sum + coach.rating, 0) / totalCoaches).toFixed(1);
  // Actions
  const handleAddCoach = (data: CoachFormValues) => {
    console.log('Adding new coach:', data);
    toast({
      title: "Coach Added Successfully",
      description: `${data.name} has been added as a ${data.sport} coach.`,
    });
    setIsAddCoachDialogOpen(false);
    form.reset();
  };

  const handleAssignStudents = (coachId: number) => {
    console.log('Assign students to coach:', coachId);
  };
  
  const handleExportReport = () => {
    console.log(`Exporting report in ${exportFormat} format`);
    // In a real implementation, we'd generate a PDF or CSV here
  };
  
  const handleDateRangeChange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    setSelectedDateRange(range);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Mock data - replace with actual API calls
  const newEnrollments = 32;
  const attendanceRate = 92.5;
  const coachCount = 15;

  const revenueBySport = [
    { sport: 'Cricket', revenue: 120000, color: '#16a34a' },
    { sport: 'Football', revenue: 95000, color: '#2563eb' },
    { sport: 'Tennis', revenue: 85000, color: '#f97316' },
    { sport: 'Athletics', revenue: 70000, color: '#ca8a04' },
    { sport: 'Others', revenue: 80000, color: '#6b7280' },
  ];

  const recentActivities = [
    { id: 1, user: 'Aarav Patel', action: 'enrolled in Cricket', time: '2 hours ago' },
    { id: 2, user: 'Coach Priya', action: 'added a new drill for Football', time: '5 hours ago' },
    { id: 3, user: 'Admin', action: 'sent a payment reminder', time: '1 day ago' },
    { id: 4, user: 'Riya Sharma', action: 'payment of ₹5000 received', time: '2 days ago' },
  ];

  const studentDemographics = {
    labels: ['Under 10', '10-13', '14-18', '18+'],
    datasets: [
      {
        label: 'Student Age Groups',
        data: [45, 78, 62, 25],
        backgroundColor: ['#3b82f6', '#16a34a', '#f97316', '#ef4444'],
      },
    ],
  };

  const handleExport = (exportFormat: 'pdf' | 'csv') => {
    toast({
      title: "Exporting Report",
      description: `Your report is being generated in ${exportFormat} format.`,
    });
    console.log(`Exporting report in ${exportFormat} format`);
    // Add actual export logic here
  };

  return (
    <DashboardLayout 
      title="Analytics Dashboard" 
      userType="admin" 
      currentPath="/admin/analytics"
    >      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold">Performance Overview</h2>
          <p className="text-sm text-muted-foreground">Analyze your academy's key metrics and trends.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileType className="h-4 w-4 mr-2" /> 
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileType className="h-4 w-4 mr-2" /> 
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">        {/* Revenue Card */}
        <Card className="shadow-sm border border-border rounded-lg">
          <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {isLoading ? <Skeleton className="h-8 w-2/3" /> : <div className="text-xl sm:text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>}
            <p className="text-xs text-muted-foreground">+{revenueGrowth}% from last month</p>
          </CardContent>
        </Card>

        {/* Students Card */}
        <Card className="shadow-sm border border-border rounded-lg">
          <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-xl sm:text-2xl font-bold">{totalStudents}</div>}
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        {/* Attendance Card */}
        <Card className="shadow-sm border border-border rounded-lg">
          <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-xl sm:text-2xl font-bold">{avgAttendance}%</div>}
            <p className="text-xs text-muted-foreground">+3.2% from last week</p>
          </CardContent>
        </Card>

        {/* Coaches Card */}
        <Card className="shadow-sm border border-border rounded-lg">
          <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Coaches</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-xl sm:text-2xl font-bold">{totalCoaches}</div>}
            <p className="text-xs text-muted-foreground">+2 new coaches this month</p>
          </CardContent>
        </Card>
      </div>      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-full max-w-md grid-cols-4 h-10">
            <TabsTrigger value="revenue" className="text-xs sm:text-sm">Revenue</TabsTrigger>
            <TabsTrigger value="students" className="text-xs sm:text-sm">Students</TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs sm:text-sm">Attendance</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
          </TabsList>
        </div>        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-7 gap-4 lg:gap-6">
            <Card className="xl:col-span-4">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue growth over the last 6 months.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {isLoading ? <Skeleton className="h-[250px] sm:h-[300px] w-full" /> : (
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData} margin={{ left: 5, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={10} tickMargin={5} />
                        <YAxis fontSize={10} tickMargin={5} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="revenue" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="xl:col-span-3">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Revenue by Sport</CardTitle>
                <CardDescription>Revenue distribution across top sports.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {isLoading ? <Skeleton className="h-[250px] sm:h-[300px] w-full" /> : (
                  <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={revenueBySport} dataKey="revenue" nameKey="sport" innerRadius="40%" strokeWidth={2} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                          {revenueBySport.map((entry) => <Cell key={entry.sport} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>        </TabsContent>

        {/* Student Analytics */}
        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Student Growth</CardTitle>
                <CardDescription>Student enrollment over time.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {isLoading ? <Skeleton className="h-[250px] sm:h-[300px] w-full" /> : (
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData} margin={{ left: 5, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={10} tickMargin={5} />
                        <YAxis fontSize={10} tickMargin={5} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Students by Sport</CardTitle>
                <CardDescription>Distribution of students across sports.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {isLoading ? <Skeleton className="h-[250px] sm:h-[300px] w-full" /> : (
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sportDistribution} margin={{ left: 5, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="sport" fontSize={10} tickMargin={5} />
                        <YAxis fontSize={10} tickMargin={5} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>        {/* Attendance Analytics */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Attendance Trends</CardTitle>
                    <CardDescription>Daily attendance patterns.</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Student</span>
                    <Switch checked={attendanceView === 'coach'} onCheckedChange={(c) => setAttendanceView(c ? 'coach' : 'student')} />
                    <span className="text-sm font-medium">Coach</span>
                  </div>
                </div>
              </CardHeader>              <CardContent className="p-4 sm:p-6 pt-0">
                {isLoading ? <Skeleton className="h-[250px] sm:h-[300px] w-full" /> : (
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={attendanceView === 'student' ? attendanceData : coachAttendanceData} margin={{ left: 5, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          fontSize={10} 
                          tickMargin={5} 
                          interval="preserveStartEnd"
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.getDate().toString();
                          }}
                        />
                        <YAxis fontSize={10} tickMargin={5} />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            });
                          }}
                        />
                        <Area type="monotone" dataKey="present" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="late" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="absent" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{attendanceView === 'student' ? 'Student' : 'Coach'} Attendance Summary</CardTitle>
                <CardDescription>Top 10 individual attendance records.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {isLoading ? (
                  <div className="space-y-2">
                    {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
                    {(attendanceView === 'student' ? studentAttendanceDetails : coachAttendanceDetails).slice(0, 10).map((person, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: person.attendanceRate > 90 ? '#10b981' : person.attendanceRate > 75 ? '#f59e0b' : '#ef4444' }}></div>
                          <div>
                            <p className="font-medium text-sm">{person.name}</p>
                            <p className="text-xs text-muted-foreground">{person.sport}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm font-medium">{person.attendanceRate}%</p>
                          <p className="text-xs text-muted-foreground">{person.present}/{person.present + person.absent + person.late}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>        {/* Performance Analytics */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Coach Performance</CardTitle>
              <CardDescription>Coach effectiveness metrics and student assignments.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">                <Input 
                  placeholder="Search coaches..." 
                  className="max-w-xs" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <Dialog open={isAddCoachDialogOpen} onOpenChange={setIsAddCoachDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Coach
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Coach</DialogTitle>
                      <DialogDescription>
                        Fill in the details below to add a new coach to your academy.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleAddCoach)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter coach's full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="sport"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sport *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select sport" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Soccer">Soccer</SelectItem>
                                    <SelectItem value="Basketball">Basketball</SelectItem>
                                    <SelectItem value="Tennis">Tennis</SelectItem>
                                    <SelectItem value="Swimming">Swimming</SelectItem>
                                    <SelectItem value="Cricket">Cricket</SelectItem>
                                    <SelectItem value="Athletics">Athletics</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="coach@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="+91 9876543210" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Experience (Years) *</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Monthly Salary (₹) *</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="50000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="qualifications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Qualifications & Certifications *</FormLabel>
                              <FormControl>
                                <textarea
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder="Enter qualifications, certifications, and relevant experience..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsAddCoachDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            Add Coach
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 p-4 font-medium text-muted-foreground text-sm border-b bg-muted/50">
                  <div className="col-span-2 sm:col-span-1">Coach</div>
                  <div className="hidden sm:block">Sport</div>
                  <div className="text-right">Students</div>
                  <div className="hidden sm:block text-right">Retention</div>
                  <div className="text-right">Rating</div>
                </div>
                <div className="divide-y">
                  {coachPerformance.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(coach => (
                    <div key={coach.id} className="grid grid-cols-3 sm:grid-cols-5 gap-4 p-4 items-center text-sm hover:bg-muted/50 transition-colors">
                      <div className="col-span-2 sm:col-span-1 font-medium">{coach.name}</div>
                      <div className="hidden sm:block text-muted-foreground">{coach.sport}</div>
                      <div className="text-right font-medium">{coach.students}</div>
                      <div className="hidden sm:block text-right">{coach.retention}%</div>
                      <div className="text-right flex items-center justify-end gap-1 text-amber-500">
                        <span className="font-semibold">{coach.rating.toFixed(1)}</span>
                        <span className="text-xs">★</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
