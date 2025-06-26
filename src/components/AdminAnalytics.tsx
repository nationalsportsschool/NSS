import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, Activity, Download, FileType, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

// Import API hooks for live data
import {
  useStudents,
  usePaymentLogs,
  useStudentAttendance,
  useCoachAttendance,
  useCoaches,
  useDrills,
} from '@/lib/api';

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
  const [attendancePeriod, setAttendancePeriod] = React.useState<'7days' | '30days' | 'quarterly' | 'yearly'>('7days');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Fetch live data using API hooks
  const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useStudents();
  const { data: paymentLogsData, isLoading: paymentsLoading, error: paymentsError } = usePaymentLogs();
  const { data: coachesData, isLoading: coachesLoading, error: coachesError } = useCoaches();
  const { data: drillsData, isLoading: drillsLoading, error: drillsError } = useDrills();
  const { 
    data: studentAttendanceData, 
    isLoading: studentAttendanceLoading, 
    error: studentAttendanceError 
  } = useStudentAttendance();
  const { 
    data: coachAttendanceData, 
    isLoading: coachAttendanceLoading, 
    error: coachAttendanceError 
  } = useCoachAttendance();

  // Ensure data is arrays with fallbacks
  const students = Array.isArray(studentsData) ? studentsData : [];
  const paymentLogs = Array.isArray(paymentLogsData) ? paymentLogsData : [];
  const coaches = Array.isArray(coachesData) ? coachesData : [];
  const drills = Array.isArray(drillsData) ? drillsData : [];
  const studentAttendance = Array.isArray(studentAttendanceData) ? studentAttendanceData : [];
  const coachAttendance = Array.isArray(coachAttendanceData) ? coachAttendanceData : [];

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

  const isDataLoading = studentsLoading || paymentsLoading || coachesLoading || drillsLoading || studentAttendanceLoading || coachAttendanceLoading || isLoading;
  
  // Calculate live analytics from real data
  const totalStudents = students.length;
  const totalRevenue = paymentLogs
    .filter(log => log.status === 'paid')
    .reduce((sum, log) => sum + (log.amount || 0), 0);
  
  const totalCoaches = coaches.length;
  
  // Calculate attendance rate from live data
  const totalAttendanceRecords = studentAttendance.length;
  const presentRecords = studentAttendance.filter(record => record.status === 'Present').length;
  const avgAttendance = totalAttendanceRecords > 0 ? Math.round((presentRecords / totalAttendanceRecords) * 100) : 0;

  // Helper function to filter data by date period
  const getDateFilterFunction = (period: '7days' | '30days' | 'quarterly' | 'yearly') => {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarterly':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'yearly':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    return (record: any) => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= now;
    };
  };

  // Generate sport distribution from live student data
  const sportDistribution = React.useMemo(() => {
    const sportCounts = students.reduce((acc, student) => {
      const sport = student.sport || 'Unknown';
      acc[sport] = (acc[sport] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    return Object.entries(sportCounts).map(([sport, count], index) => ({
      sport,
      students: count,
      revenue: Number(count) * 1800, // Estimated average revenue per student
      color: colors[index % colors.length]
    }));
  }, [students]);

  // Generate revenue by sport from sport distribution
  const revenueBySport = React.useMemo(() => {
    return sportDistribution.map(item => ({
      sport: item.sport,
      revenue: item.revenue,
      color: item.color
    }));
  }, [sportDistribution]);

  // Generate revenue trend from payment data
  const revenueData = React.useMemo(() => {
    const monthlyRevenue = paymentLogs
      .filter(log => log.status === 'paid')
      .reduce((acc, log) => {
        const date = new Date(log.payment_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + (log.amount || 0);
        return acc;
      }, {} as Record<string, number>);

    // Get last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      months.push({
        month: monthName,
        revenue: monthlyRevenue[monthKey] || 0,
        students: Math.floor((monthlyRevenue[monthKey] || 0) / 1800) // Estimated students
      });
    }
    return months;
  }, [paymentLogs]);

  // Generate attendance trends from live data with date filtering
  const attendanceData = React.useMemo(() => {
    const filteredAttendance = studentAttendance.filter(getDateFilterFunction(attendancePeriod));
    
    const dailyAttendance = filteredAttendance.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = { present: 0, absent: 0, late: 0 };
      }
      const status = record.status.toLowerCase();
      if (status === 'present') acc[date].present++;
      else if (status === 'absent') acc[date].absent++;
      else if (status === 'late') acc[date].late++;
      return acc;
    }, {} as Record<string, { present: number; absent: number; late: number }>);

    const sortedDates = Object.entries(dailyAttendance)
      .sort(([a], [b]) => a.localeCompare(b));

    // Limit the number of data points based on period
    const dataLimit = attendancePeriod === '7days' ? 7 : 
                     attendancePeriod === '30days' ? 30 : 
                     attendancePeriod === 'quarterly' ? 90 : 365;

    return sortedDates
      .slice(-dataLimit)
      .map(([date, counts]) => {
        const attendanceCounts = counts as { present: number; absent: number; late: number };
        return {
          date,
          present: attendanceCounts.present,
          absent: attendanceCounts.absent,
          late: attendanceCounts.late
        };
      });
  }, [studentAttendance, attendancePeriod]);

  // Generate coach attendance data with date filtering
  const coachAttendanceChartData = React.useMemo(() => {
    const filteredCoachAttendance = coachAttendance.filter(getDateFilterFunction(attendancePeriod));
    
    const dailyCoachAttendance = filteredCoachAttendance.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = { present: 0, absent: 0, late: 0 };
      }
      const status = record.status.toLowerCase();
      if (status === 'present') acc[date].present++;
      else if (status === 'absent') acc[date].absent++;
      else if (status === 'late') acc[date].late++;
      return acc;
    }, {} as Record<string, { present: number; absent: number; late: number }>);

    const sortedDates = Object.entries(dailyCoachAttendance)
      .sort(([a], [b]) => a.localeCompare(b));

    // Limit the number of data points based on period
    const dataLimit = attendancePeriod === '7days' ? 7 : 
                     attendancePeriod === '30days' ? 30 : 
                     attendancePeriod === 'quarterly' ? 90 : 365;

    return sortedDates
      .slice(-dataLimit)
      .map(([date, counts]) => {
        const coachCounts = counts as { present: number; absent: number; late: number };
        return {
          date,
          present: coachCounts.present,
          absent: coachCounts.absent,
          late: coachCounts.late
        };
      });
  }, [coachAttendance, attendancePeriod]);

  // Calculate detailed student attendance for individual performance
  const studentAttendanceDetails = React.useMemo(() => {
    const filteredAttendance = studentAttendance.filter(getDateFilterFunction(attendancePeriod));
    
    const studentStats = students.map(student => {
      const studentRecords = filteredAttendance.filter(record => record.student_id === student.id);
      const present = studentRecords.filter(r => r.status === 'Present').length;
      const absent = studentRecords.filter(r => r.status === 'Absent').length;
      const late = studentRecords.filter(r => r.status === 'Late').length;
      const total = present + absent + late;
      const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
      
      return {
        name: student.name,
        sport: student.sport,
        present,
        absent,
        late,
        attendanceRate
      };
    }).sort((a, b) => b.attendanceRate - a.attendanceRate);

    return studentStats;
  }, [students, studentAttendance, attendancePeriod]);

  // Calculate coach attendance details for individual performance
  const coachAttendanceDetails = React.useMemo(() => {
    const filteredCoachAttendance = coachAttendance.filter(getDateFilterFunction(attendancePeriod));
    
    const coachStats = coaches.map(coach => {
      const coachRecords = filteredCoachAttendance.filter(record => record.coach_id === coach.id);
      const present = coachRecords.filter(r => r.status === 'Present').length;
      const absent = coachRecords.filter(r => r.status === 'Absent').length;
      const late = coachRecords.filter(r => r.status === 'Late').length;
      const total = present + absent + late;
      const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
      
      return {
        name: coach.name,
        sport: Array.isArray(coach.sports) ? coach.sports.join(', ') : coach.sports || 'Unknown',
        present,
        absent,
        late,
        attendanceRate
      };
    }).sort((a, b) => b.attendanceRate - a.attendanceRate);

    return coachStats;
  }, [coaches, coachAttendance, attendancePeriod]);

  // Generate final coach attendance chart data
  const finalCoachAttendanceData = coachAttendanceChartData;

  // Calculate growth metrics
  const revenueGrowth = revenueData.length >= 2 
    ? ((revenueData[revenueData.length - 1].revenue - revenueData[revenueData.length - 2].revenue) / revenueData[revenueData.length - 2].revenue * 100).toFixed(1)
    : "0";
  const handleExport = (exportFormat: 'pdf' | 'csv') => {
    toast({
      title: "Exporting Report",
      description: `Your report is being generated in ${exportFormat} format.`,
    });
    console.log(`Exporting report in ${exportFormat} format`);
  };

  return (
    <DashboardLayout 
      title="Analytics Dashboard" 
      userType="admin" 
      currentPath="/admin/analytics"
    >      
      {/* Page Header */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Revenue Card */}
        <Card className="shadow-sm border border-border rounded-lg">
          <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {isDataLoading ? <Skeleton className="h-8 w-2/3" /> : <div className="text-xl sm:text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>}
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
            {isDataLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-xl sm:text-2xl font-bold">{totalStudents}</div>}
            <p className="text-xs text-muted-foreground">Active students enrolled</p>
          </CardContent>
        </Card>

        {/* Attendance Card */}
        <Card className="shadow-sm border border-border rounded-lg">
          <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {isDataLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-xl sm:text-2xl font-bold">{avgAttendance}%</div>}
            <p className="text-xs text-muted-foreground">Average attendance rate</p>
          </CardContent>
        </Card>

        {/* Coaches Card */}
        <Card className="shadow-sm border border-border rounded-lg">
          <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Coaches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {isDataLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-xl sm:text-2xl font-bold">{totalCoaches}</div>}
            <p className="text-xs text-muted-foreground">Professional coaches</p>
          </CardContent>
        </Card>
      </div>      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-10">
            <TabsTrigger value="revenue" className="text-xs sm:text-sm">Revenue</TabsTrigger>
            <TabsTrigger value="students" className="text-xs sm:text-sm">Students</TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs sm:text-sm">Attendance</TabsTrigger>
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
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                  <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                      <AreaChart data={attendanceView === 'student' ? attendanceData : finalCoachAttendanceData} margin={{ left: 5, right: 5, top: 5, bottom: 0 }}>
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
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
