
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Calendar, Download, ArrowLeft, Clock, MapPin, User, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock analytics data
const revenueData = [
  { month: 'Jan', revenue: 12400, students: 45, coaches: 8 },
  { month: 'Feb', revenue: 13200, students: 52, coaches: 9 },
  { month: 'Mar', revenue: 14800, students: 58, coaches: 10 },
  { month: 'Apr', revenue: 16200, students: 64, coaches: 11 },
  { month: 'May', revenue: 17500, students: 68, coaches: 12 },
  { month: 'Jun', revenue: 18900, students: 72, coaches: 12 }
];

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
  { id: 6, name: 'Coach Emma', students: 20, retention: 93, rating: 4.8, sport: 'Basketball' },
  { id: 7, name: 'Coach Ryan', students: 17, retention: 87, rating: 4.4, sport: 'Tennis' },
  { id: 8, name: 'Coach Maria', students: 23, retention: 96, rating: 4.9, sport: 'Swimming' },
  { id: 9, name: 'Coach Alex', students: 19, retention: 89, rating: 4.6, sport: 'Soccer' },
  { id: 10, name: 'Coach Sophie', students: 21, retention: 91, rating: 4.7, sport: 'Basketball' },
  { id: 11, name: 'Coach Daniel', students: 16, retention: 85, rating: 4.3, sport: 'Tennis' },
  { id: 12, name: 'Coach Anna', students: 24, retention: 97, rating: 5.0, sport: 'Swimming' },
  { id: 13, name: 'Coach Kevin', students: 26, retention: 88, rating: 4.5, sport: 'Soccer' },
  { id: 14, name: 'Coach Rachel', students: 18, retention: 94, rating: 4.8, sport: 'Basketball' },
  { id: 15, name: 'Coach Tom', students: 14, retention: 86, rating: 4.4, sport: 'Tennis' },
  { id: 16, name: 'Coach Grace', students: 22, retention: 95, rating: 4.9, sport: 'Swimming' },
  { id: 17, name: 'Coach Mark', students: 27, retention: 89, rating: 4.6, sport: 'Soccer' },
  { id: 18, name: 'Coach Julia', students: 19, retention: 92, rating: 4.7, sport: 'Basketball' },
  { id: 19, name: 'Coach Chris', students: 13, retention: 84, rating: 4.2, sport: 'Tennis' },
  { id: 20, name: 'Coach Nina', students: 25, retention: 98, rating: 5.0, sport: 'Swimming' },
  { id: 21, name: 'Coach Ben', students: 23, retention: 87, rating: 4.5, sport: 'Soccer' },
  { id: 22, name: 'Coach Kate', students: 17, retention: 93, rating: 4.8, sport: 'Basketball' },
  { id: 23, name: 'Coach Luke', students: 15, retention: 85, rating: 4.3, sport: 'Tennis' },
  { id: 24, name: 'Coach Zoe', students: 21, retention: 96, rating: 4.9, sport: 'Swimming' },
  { id: 25, name: 'Coach Matt', students: 24, retention: 88, rating: 4.4, sport: 'Soccer' },
  { id: 26, name: 'Coach Lily', students: 16, retention: 91, rating: 4.6, sport: 'Basketball' },
  { id: 27, name: 'Coach Jake', students: 12, retention: 83, rating: 4.1, sport: 'Tennis' },
  { id: 28, name: 'Coach Mia', students: 20, retention: 94, rating: 4.7, sport: 'Swimming' },
  { id: 29, name: 'Coach Sam', students: 22, retention: 86, rating: 4.3, sport: 'Soccer' },
  { id: 30, name: 'Coach Chloe', students: 18, retention: 89, rating: 4.5, sport: 'Basketball' },
  { id: 31, name: 'Coach Noah', students: 11, retention: 82, rating: 4.0, sport: 'Tennis' },
  { id: 32, name: 'Coach Ella', students: 19, retention: 93, rating: 4.8, sport: 'Swimming' },
  { id: 33, name: 'Coach Owen', students: 21, retention: 85, rating: 4.2, sport: 'Soccer' },
  { id: 34, name: 'Coach Ava', students: 15, retention: 90, rating: 4.6, sport: 'Basketball' },
  { id: 35, name: 'Coach Ethan', students: 10, retention: 81, rating: 3.9, sport: 'Tennis' },
  { id: 36, name: 'Coach Maya', students: 17, retention: 92, rating: 4.7, sport: 'Swimming' },
  { id: 37, name: 'Coach Leo', students: 20, retention: 84, rating: 4.1, sport: 'Soccer' },
  { id: 38, name: 'Coach Nora', students: 14, retention: 88, rating: 4.4, sport: 'Basketball' },
  { id: 39, name: 'Coach Ian', students: 9, retention: 80, rating: 3.8, sport: 'Tennis' },
  { id: 40, name: 'Coach Ruby', students: 16, retention: 91, rating: 4.5, sport: 'Swimming' }
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

// Generate detailed student attendance (40 students)
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

// Generate detailed coach attendance (40 coaches)
const generateCoachAttendance = () => {
  const coaches = [];
  const sports = ['Soccer', 'Basketball', 'Tennis', 'Swimming'];
  
  for (let i = 0; i < 40; i++) {
    const present = Math.floor(Math.random() * 2) + 6; // 6-7 days
    const absent = Math.floor(Math.random() * 2); // 0-1 days
    const late = Math.floor(Math.random() * 2); // 0-1 days
    const total = present + absent + late;
    const attendanceRate = Math.round((present / total) * 100);
    const avgHours = (Math.random() * 2 + 7).toFixed(1); // 7.0-9.0 hours
    
    coaches.push({
      name: coachPerformance[i].name,
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
  onBack: () => void;
}

const AdminAnalytics = ({ onBack }: AdminAnalyticsProps) => {
  const [attendanceView, setAttendanceView] = React.useState<'student' | 'coach'>('student');
  const [showCoachManagement, setShowCoachManagement] = React.useState(false);
  
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalStudents = Math.max(...revenueData.map(item => item.students));
  const revenueGrowth = ((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue * 100).toFixed(1);
  const avgAttendance = ((attendanceData.reduce((sum, item) => sum + item.present, 0) / attendanceData.length) / (attendanceData[0].present + attendanceData[0].absent + attendanceData[0].late) * 100).toFixed(1);

  const handleAddCoach = () => {
    console.log('Add new coach');
  };

  const handleAssignStudents = (coachId: number) => {
    console.log('Assign students to coach:', coachId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 py-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
            </div>
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{revenueGrowth}% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgAttendance}%</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.2% this week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Success</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% improvement
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Revenue Analytics */}
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#ef4444" 
                          fill="#ef4444" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Sport</CardTitle>
                  <CardDescription>Revenue distribution across different sports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sportDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="revenue"
                          label={(entry: any) => `${entry.sport}: $${entry.revenue}`}
                        >
                          {sportDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Student Analytics */}
          <TabsContent value="students" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Growth</CardTitle>
                  <CardDescription>Student enrollment over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="students" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Students by Sport</CardTitle>
                  <CardDescription>Distribution of students across sports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sportDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="sport" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance Analytics */}
          <TabsContent value="attendance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Attendance Trends</CardTitle>
                      <CardDescription>
                        {attendanceView === 'student' ? 'Daily student attendance patterns' : 'Daily coach attendance patterns'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Students</span>
                        <Switch
                          checked={attendanceView === 'coach'}
                          onCheckedChange={(checked) => setAttendanceView(checked ? 'coach' : 'student')}
                        />
                        <span className="text-sm font-medium">Coaches</span>
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={attendanceView === 'student' ? attendanceData : coachAttendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="present" 
                          stackId="1"
                          stroke="#10b981" 
                          fill="#10b981" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="late" 
                          stackId="1"
                          stroke="#f59e0b" 
                          fill="#f59e0b" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="absent" 
                          stackId="1"
                          stroke="#ef4444" 
                          fill="#ef4444" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {attendanceView === 'student' ? 'Student' : 'Coach'} Attendance Summary
                  </CardTitle>
                  <CardDescription>
                    Individual attendance records and rates (showing 10 of {attendanceView === 'student' ? studentAttendanceDetails.length : coachAttendanceDetails.length})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {(attendanceView === 'student' ? studentAttendanceDetails : coachAttendanceDetails).slice(0, 10).map((person, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-sm">{person.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {person.sport}
                            </Badge>
                            {attendanceView === 'coach' && 'avgHours' in person && (
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{person.avgHours}h avg</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center space-x-3 text-xs">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{person.present}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span>{person.late}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>{person.absent}</span>
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {person.attendanceRate}% attendance
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payments Analytics */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
                <CardDescription>Payment success and outstanding payments over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={paymentTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="successful" 
                        stackId="1"
                        stroke="#10b981" 
                        fill="#10b981" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pending" 
                        stackId="1"
                        stroke="#f59e0b" 
                        fill="#f59e0b" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="not_paid" 
                        stackId="1"
                        stroke="#ef4444" 
                        fill="#ef4444" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Analytics */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Coach Performance</CardTitle>
                    <CardDescription>Coach effectiveness metrics and student assignments</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleAddCoach} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Coach
                    </Button>
                    <Button
                      onClick={() => setShowCoachManagement(!showCoachManagement)}
                      variant="outline"
                      size="sm"
                    >
                      {showCoachManagement ? 'View Performance' : 'Manage Students'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  <div className="text-sm text-gray-600 mb-4">
                    Showing 10 of {coachPerformance.length} coaches
                  </div>
                  {coachPerformance.slice(0, 10).map((coach, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{coach.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-600">{coach.students} students</p>
                          <Badge variant="outline" className="text-xs">{coach.sport}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {!showCoachManagement ? (
                          <>
                            <div className="text-center">
                              <div className="text-sm font-medium">{coach.retention}%</div>
                              <div className="text-xs text-gray-500">Retention</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">{coach.rating}/5</div>
                              <div className="text-xs text-gray-500">Rating</div>
                            </div>
                            <Badge variant={coach.retention > 90 ? "default" : "secondary"}>
                              {coach.retention > 90 ? "Excellent" : "Good"}
                            </Badge>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleAssignStudents(coach.id)}
                            size="sm"
                            variant="outline"
                          >
                            Assign Students
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalytics;
