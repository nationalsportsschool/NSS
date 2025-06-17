
import React from 'react';
import { Users } from 'lucide-react';
import ChildAttendanceCard from '@/components/ChildAttendanceCard';
import CoachInfoCard from '@/components/CoachInfoCard';
import PaymentCard from '@/components/PaymentCard';

const ParentDashboard = () => {
  // Sample data - in real app this would come from API
  const childData = {
    name: "Alex Johnson",
    rollNumber: "S012",
    attendanceRecords: [
      {
        id: '1',
        date: '2024-06-10',
        status: 'present' as const,
        sport: 'Football',
        coach: 'Mike Wilson'
      },
      {
        id: '2',
        date: '2024-06-09',
        status: 'present' as const,
        sport: 'Swimming',
        coach: 'Sarah Davis'
      },
      {
        id: '3',
        date: '2024-06-08',
        status: 'late' as const,
        sport: 'Basketball',
        coach: 'John Smith'
      },
      {
        id: '4',
        date: '2024-06-07',
        status: 'absent' as const,
        sport: 'Tennis',
        coach: 'Emma Brown'
      },
      {
        id: '5',
        date: '2024-06-06',
        status: 'present' as const,
        sport: 'Football',
        coach: 'Mike Wilson'
      }
    ]
  };

  const coachInfo = {
    id: '1',
    name: 'Coach Mike Wilson',
    sports: ['Football', 'Athletics', 'Soccer'],
    experience: '8 years',
    phone: '+1-234-567-8900',
    email: 'mike.wilson@sportsschool.edu',
    schedule: 'Monday to Friday, 3:00 PM - 6:00 PM'
  };

  console.log('=== PARENT DASHBOARD LOADED ===');
  console.log('Child:', childData.name);
  console.log('Roll Number:', childData.rollNumber);
  console.log('Total Attendance Records:', childData.attendanceRecords.length);
  console.log('Current Coach:', coachInfo.name);
  console.log('Coach Sports:', coachInfo.sports);
  console.log('Dashboard Load Time:', new Date().toISOString());
  console.log('==============================');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          </div>
          <p className="text-gray-600">Welcome back! Here's your child's progress and school information</p>
        </div>
        
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ChildAttendanceCard 
              childName={childData.name}
              rollNumber={childData.rollNumber}
              attendanceRecords={childData.attendanceRecords}
            />
            
            <PaymentCard 
              childName={childData.name}
              pendingFees={150}
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <CoachInfoCard 
              coachInfo={coachInfo}
              childName={childData.name}
            />
            
            {/* Quick Stats */}
            <div className="bg-card shadow-sm border border-border rounded-lg p-5">
              <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-primary">85%</div>
                  <div className="text-sm text-muted-foreground">Attendance Rate</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Active Sports</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
