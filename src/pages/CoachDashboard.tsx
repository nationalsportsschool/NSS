import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  batch: string;
  status: 'present' | 'absent';
}

const CoachDashboard = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'John Smith',
      rollNumber: 'S001',
      batch: 'Morning Batch A',
      status: 'present'
    }, {
      id: '2',
      name: 'Emma Johnson',
      rollNumber: 'S002',
      batch: 'Morning Batch A',
      status: 'absent'
    }, {
      id: '3',
      name: 'Michael Brown',
      rollNumber: 'S003',
      batch: 'Morning Batch A',
      status: 'present'
    }, {
      id: '4',
      name: 'Sarah Davis',
      rollNumber: 'S004',
      batch: 'Evening Batch B',
      status: 'present'
    }, {
      id: '5',
      name: 'David Wilson',
      rollNumber: 'S005',
      batch: 'Evening Batch B',
      status: 'present'
    }
  ]);

  const handleCheckIn = () => {
    const timestamp = new Date();
    
    console.log('=== COACH CHECK-IN ===');
    console.log('Check-in initiated at:', timestamp.toISOString());
    console.log('Formatted time:', timestamp.toLocaleString());
    
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          console.log('Geolocation successful:');
          console.log('- Latitude:', location.latitude);
          console.log('- Longitude:', location.longitude);
          console.log('- Accuracy:', location.accuracy, 'meters');
          console.log('- GPS timestamp:', new Date(location.timestamp).toISOString());
          console.log('Complete check-in data:', {
            checkInTime: timestamp.toISOString(),
            location: location,
            formattedTime: timestamp.toLocaleString(),
            coachStatus: 'checked-in'
          });
        },
        (error) => {
          console.log('Geolocation failed:');
          console.log('- Error code:', error.code);
          console.log('- Error message:', error.message);
          console.log('Check-in completed without location data');
          console.log('Check-in data (no location):', {
            checkInTime: timestamp.toISOString(),
            location: null,
            formattedTime: timestamp.toLocaleString(),
            coachStatus: 'checked-in',
            locationError: error.message
          });
        }
      );
    } else {
      console.log('Geolocation not supported by browser');
      console.log('Check-in data (no geolocation support):', {
        checkInTime: timestamp.toISOString(),
        location: null,
        formattedTime: timestamp.toLocaleString(),
        coachStatus: 'checked-in',
        locationError: 'Geolocation not supported'
      });
    }

    setIsCheckedIn(true);
    setCheckInTime(timestamp);
    console.log('Coach state updated: isCheckedIn = true');
    console.log('======================');
    
    toast({
      title: "Checked In",
      description: "Session started",
    });
  };

  const handleCheckOut = () => {
    const checkOutTime = new Date();
    const duration = checkInTime ? 
      Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60)) : 0;
    
    const sessionData = {
      checkInTime: checkInTime?.toISOString() || null,
      checkOutTime: checkOutTime.toISOString(),
      durationMinutes: duration,
      sessionDate: checkOutTime.toDateString(),
      coachStatus: 'checked-out'
    };

    console.log('=== COACH CHECK-OUT ===');
    console.log('Check-out initiated at:', checkOutTime.toISOString());
    console.log('Check-in time was:', checkInTime?.toISOString() || 'Not recorded');
    console.log('Session duration:', duration, 'minutes');
    console.log('Session summary:', sessionData);
    console.log('Coach state updated: isCheckedIn = false');
    console.log('=======================');
    
    setIsCheckedIn(false);
    setCheckInTime(null);
    
    toast({
      title: "Checked Out",
      description: `Session duration: ${duration} minutes`,
    });
  };
  const setStudentStatus = (studentId: string, status: 'present' | 'absent') => {
    console.log('Setting student status for student ID:', studentId, 'to:', status);
    
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        console.log(`Student ${student.name} (${student.rollNumber}) status changed from ${student.status} to ${status}`);
        return { ...student, status };
      }
      return student;
    }));
  };
  const handleSubmitAttendance = () => {
    const attendanceData = {
      submissionTime: new Date().toISOString(),
      sessionDate: new Date().toDateString(),
      coachCheckIn: checkInTime?.toISOString() || null,
      totalStudents: students.length,
      presentCount: students.filter(s => s.status === 'present').length,
      absentCount: students.filter(s => s.status === 'absent').length,
      students: students.map(student => ({
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        batch: student.batch,
        status: student.status
      }))
    };

    console.log('=== ATTENDANCE SUBMISSION ===');
    console.log('Submission initiated at:', new Date().toISOString());
    console.log('Session date:', attendanceData.sessionDate);
    console.log('Coach check-in time:', attendanceData.coachCheckIn);
    console.log('Total students:', attendanceData.totalStudents);
    console.log('Present students:', attendanceData.presentCount);
    console.log('Absent students:', attendanceData.absentCount);
    console.log('Detailed attendance:');
    attendanceData.students.forEach(student => {
      console.log(`- ${student.name} (${student.rollNumber}): ${student.status.toUpperCase()}`);
    });
    console.log('Complete attendance data:', attendanceData);
    console.log('==============================');

    toast({
      title: "Attendance Submitted",
      description: `${attendanceData.presentCount} present, ${attendanceData.absentCount} absent`,
    });
  };
  const getStatusButtons = (student: Student) => {
    return (
      <div className="flex gap-3">
        <Button
          onClick={() => setStudentStatus(student.id, 'present')}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            student.status === 'present'
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-700 border border-gray-300'
          }`}
        >
          Present
        </Button>
        <Button
          onClick={() => setStudentStatus(student.id, 'absent')}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            student.status === 'absent'
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-700 border border-gray-300'
          }`}
        >
          Absent
        </Button>
      </div>
    );
  };
  return (
    <DashboardLayout
      title="Coach Dashboard"
      userType="coach"
      currentPath="/coach/dashboard"
    >
      <div className="space-y-6">
        {/* Check In/Out Button */}
        <Card>
          <CardHeader>
            <CardTitle>Session Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isCheckedIn ? (
              <Button
                onClick={handleCheckOut}
              className="w-full h-14 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium text-lg"
            >
              Check Out
            </Button>
          ) : (
            <Button
              onClick={handleCheckIn}
              className="w-full h-14 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium text-lg"
            >              Check In
            </Button>
          )}
          {isCheckedIn && checkInTime && (
            <p className="text-sm text-gray-600 mt-3 text-center">
              Session started at {checkInTime.toLocaleTimeString()}
            </p>
          )}
          </CardContent>
        </Card>

        {/* Students List */}        <Card>
          <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
          </CardHeader>
          <CardContent>            <div className="space-y-4">
              {students.map(student => (
                <div key={student.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{student.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{student.rollNumber} • {student.batch}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {getStatusButtons(student)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Submit Attendance Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSubmitAttendance}
                className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-lg"
              >
                Submit Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CoachDashboard;
