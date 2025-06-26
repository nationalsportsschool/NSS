import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Users, Clock, CheckCircle, Activity, CreditCard, MessageSquare } from 'lucide-react';
import ChildAttendanceCard from '@/components/ChildAttendanceCard';
import CoachInfoCard from '@/components/CoachInfoCard';
import PaymentCard from '@/components/PaymentCard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useParentChildren, useChildAttendance, useChildPayments } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const ParentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get logged-in parent data
  const parentData = JSON.parse(localStorage.getItem('parentData') || '{}');
  const parentId = parentData.id;
  
  // Fetch parent's children and their data
  const { data: children = [], isLoading: childrenLoading } = useParentChildren(parentId);
  const childData = children[0] || null; // For now, show first child (can expand to show all)
  
  const { data: childAttendance = [], isLoading: attendanceLoading } = useChildAttendance(childData?.id);
  const { data: childPayments = [], isLoading: paymentsLoading } = useChildPayments(childData?.id);
  
  const isLoading = childrenLoading || attendanceLoading || paymentsLoading;

  // Get child's attendance records
  const childAttendanceRecords = React.useMemo(() => {
    if (!childData || !Array.isArray(childAttendance)) return [];
    return (childAttendance as any[])
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10) // Last 10 records
      .map(record => ({
        id: record.id.toString(),
        date: record.date,
        status: record.status.toLowerCase() as 'present' | 'absent' | 'late',
        sport: childData.sport,
        coach: 'Coach'
      }));
  }, [childAttendance, childData]);

  // Get child's payment records
  const childPaymentHistory = React.useMemo(() => {
    if (!childData || !Array.isArray(childPayments)) return [];
    return (childPayments as any[])
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
      .slice(0, 5) // Last 5 payments
      .map(log => ({
        id: log.id,
        date: log.payment_date,
        amount: `₹${log.amount}`,
        description: `${childData.sport} Fees`,
        status: log.status
      }));
  }, [childPayments, childData]);

  // Mock coach info (would be fetched from API in real app)
  const coachInfo = {
    id: '1',
    name: 'Coach Tamil',
    sports: [childData?.sport || 'Sports'],
    experience: '10 years',
    phone: '+91 98765 43210',
    email: 'coach@sportsschool.co.in',
    schedule: 'Monday to Friday, 4:00 PM - 7:00 PM'
  };

  // Generate upcoming classes based on current sport
  const upcomingClasses = React.useMemo(() => {
    if (!childData) return [];
    const today = new Date();
    const classes = [];
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      classes.push({
        id: i + 1,
        title: `${childData.sport} Practice`,
        time: '4:30 PM - 6:00 PM',
        coach: 'Coach Tamil',
        location: `${childData.sport} Ground`,
        daysTill: i
      });
    }
    return classes;
  }, [childData]);

  // Calculate attendance rate
  const attendanceRate = React.useMemo(() => {
    if (!childAttendanceRecords.length) return 0;
    const presentCount = childAttendanceRecords.filter(r => r.status === 'present').length;
    return Math.round((presentCount / childAttendanceRecords.length) * 100);
  }, [childAttendanceRecords]);

  const activeSports = childData ? 1 : 0; // For simplicity, each student has one primary sport

  // Check if parent is logged in
  if (!parentId) {
    return (
      <DashboardLayout
        title="Parent Dashboard"
        userType="parent"
        currentPath="/parent/dashboard"
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
              <CardDescription>
                Please log in as a parent to access this dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = '/'} className="mt-4">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout
        title="Student Dashboard"
        userType="parent"
        currentPath="/parent/dashboard"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-md">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Check if parent has no children
  if (!isLoading && (!children || (Array.isArray(children) && children.length === 0))) {
    return (
      <DashboardLayout
        title="Parent Dashboard"
        userType="parent"
        currentPath="/parent/dashboard"
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-xl text-gray-600">No Children Found</CardTitle>
              <CardDescription>
                No children are registered under your account. Please contact the school administration.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!childData) {
    return (
      <DashboardLayout
        title="Student Dashboard"
        userType="parent"
        currentPath="/parent/dashboard"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Data</h3>
            <p className="text-gray-500">Please contact administration to set up your child's profile.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`${childData.name}'s Dashboard`}
      userType="parent"
      currentPath="/parent/dashboard"
    >
      <div className="space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold text-green-600">{attendanceRate}%</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sports</p>
                  <p className="text-2xl font-bold text-blue-600">{activeSports}</p>
                  <p className="text-xs text-muted-foreground">Currently enrolled</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Next Class</p>
                  <p className="text-2xl font-bold text-orange-600">Today</p>
                  <p className="text-xs text-muted-foreground">4:30 PM</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Fees</p>
                  <p className="text-2xl font-bold text-red-600">₹10</p>
                  <p className="text-xs text-muted-foreground">Test payment</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Classes */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Classes</CardTitle>
                <CardDescription>Your child's scheduled sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{classItem.title}</h4>
                        <p className="text-sm text-muted-foreground">{classItem.time} • {classItem.coach}</p>
                        <p className="text-xs text-muted-foreground">{classItem.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={classItem.daysTill === 0 ? "default" : "secondary"}>
                        {classItem.daysTill === 0 ? "Today" : classItem.daysTill === 1 ? "Tomorrow" : `${classItem.daysTill} days`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Payment History</CardTitle>
                <CardDescription>Recent fee payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {childPaymentHistory.length > 0 ? (
                    childPaymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{payment.amount}</p>
                          <Badge variant={payment.status === 'paid' ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No payment history available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PaymentCard childName={childData.name} pendingFees={10} />
            
            {/* Quick Actions */}
            <ChildAttendanceCard 
              childName={childData.name} 
              rollNumber={childData.roll_number} 
              attendanceRecords={childAttendanceRecords} 
            />
            <CoachInfoCard coachInfo={coachInfo} childName={childData.name} />

            {/* Calendar */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
