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

// Sample data - in real app this would come from API
const childData = {
  name: "Rohan Sharma",
  rollNumber: "S012",
  attendanceRecords: [
    {
      id: '1',
      date: '2025-06-10',
      status: 'present' as const,
      sport: 'Cricket',
      coach: 'Suresh Kumar'
    },
    {
      id: '2',
      date: '2025-06-09',
      status: 'present' as const,
      sport: 'Swimming',
      coach: 'Anjali Mehta'
    },
    {
      id: '3',
      date: '2025-06-08',
      status: 'late' as const,
      sport: 'Football',
      coach: 'Rajesh Singh'
    },
    {
      id: '4',
      date: '2025-06-07',
      status: 'absent' as const,
      sport: 'Tennis',
      coach: 'Priya Desai'
    },
    {
      id: '5',
      date: '2025-06-06',
      status: 'present' as const,
      sport: 'Cricket',
      coach: 'Suresh Kumar'
    }
  ]
};

const coachInfo = {
  id: '1',
  name: 'Coach Suresh Kumar',
  sports: ['Cricket', 'Athletics', 'Football'],
  experience: '10 years',
  phone: '+91 98765 43210',
  email: 'suresh.kumar@sportsschool.co.in',
  schedule: 'Monday to Friday, 4:00 PM - 7:00 PM'
};

// Mock upcoming classes
const upcomingClasses = [
  { id: 1, title: 'Cricket Practice', time: '4:30 PM - 6:00 PM', coach: 'Suresh Kumar', location: 'Main Ground', daysTill: 0 },
  { id: 2, title: 'Swimming Session', time: '5:00 PM - 6:00 PM', coach: 'Anjali Mehta', location: 'Pool A', daysTill: 1 },
  { id: 3, title: 'Football Drills', time: '6:00 PM - 7:30 PM', coach: 'Rajesh Singh', location: 'Field B', daysTill: 2 }
];

// Mock payment history
const paymentHistory = [
  { id: 1, date: '2025-06-01', amount: '₹5000', description: 'June Cricket Fees', status: 'paid' },
  { id: 2, date: '2025-05-15', amount: '₹3500', description: 'Swimming Package', status: 'paid' },
  { id: 3, date: '2025-05-01', amount: '₹5000', description: 'May Cricket Fees', status: 'paid' },
  { id: 4, date: '2025-04-15', amount: '₹4000', description: 'Tennis Coaching', status: 'paid' }
];

const ParentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Calculate some stats
  const attendanceRate = Math.round(
    (childData.attendanceRecords.filter(r => r.status === 'present').length / childData.attendanceRecords.length) * 100
  );
  
  const uniqueSports = new Set(childData.attendanceRecords.map(r => r.sport));
  const activeSports = uniqueSports.size;

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
                  <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
                  <div className="text-2xl font-bold">{attendanceRate}%</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Good performance
                  </div>
                </div>
                <div className="rounded-full p-3 bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Sports</p>
                  <div className="text-2xl font-bold">{activeSports}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Well-rounded curriculum
                  </div>
                </div>
                <div className="rounded-full p-3 bg-blue-100">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Next Class</p>
                  <div className="text-2xl font-bold">Today</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {upcomingClasses[0].time}
                  </div>
                </div>
                <div className="rounded-full p-3 bg-amber-100">
                  <CalendarIcon className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <PaymentCard childName={childData.name} pendingFees={5000} />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
            <ChildAttendanceCard childName={childData.name} rollNumber={childData.rollNumber} attendanceRecords={childData.attendanceRecords} />
            <CoachInfoCard coachInfo={coachInfo} childName={childData.name} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
