import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [drillTitle, setDrillTitle] = useState('Passing and Dribbling');
  const [drillImage, setDrillImage] = useState('https://images.unsplash.com/photo-1543351348-385b61a20366?w=400&h=225&fit=crop');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newDrillTitle, setNewDrillTitle] = useState('');
  const [newDrillImageFile, setNewDrillImageFile] = useState<File | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string>('All Batches');
  
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
      status: 'present'
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

  // Get unique batches from students
  const uniqueBatches = Array.from(new Set(students.map(student => student.batch)));
  
  // Filter students based on selected batch
  const filteredStudents = selectedBatch === 'All Batches' 
    ? students 
    : students.filter(student => student.batch === selectedBatch);

  const handleCheckIn = () => {
    const timestamp = new Date();
    
    console.log('=== COACH CHECK-IN ===');
    console.log('Check-in initiated at:', timestamp.toISOString());
    console.log('Formatted time:', timestamp.toLocaleString());
    
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const entryLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
          };
          
          console.log('Geolocation successful:');
          console.log('- Latitude:', entryLocation.latitude);
          console.log('- Longitude:', entryLocation.longitude);
          console.log('- Accuracy:', entryLocation.accuracy, 'meters');
          console.log('- GPS timestamp:', new Date(entryLocation.timestamp).toISOString());
          console.log('Complete check-in data:', {
            checkInTime: timestamp.toISOString(),
            entryLocation: entryLocation,
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
            entryLocation: null,
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
        entryLocation: null,
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
      description: "Session started with location tracking",
    });
  };

  const handleCheckOut = () => {
    const checkOutTime = new Date();
    const duration = checkInTime ? 
      Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60)) : 0;
    
    // Get exit location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const exitLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
          };
          
          const sessionData = {
            checkInTime: checkInTime?.toISOString() || null,
            checkOutTime: checkOutTime.toISOString(),
            durationMinutes: duration,
            sessionDate: checkOutTime.toDateString(),
            coachStatus: 'checked-out',
            exitLocation: exitLocation
          };

          console.log('=== COACH CHECK-OUT ===');
          console.log('Check-out initiated at:', checkOutTime.toISOString());
          console.log('Check-in time was:', checkInTime?.toISOString() || 'Not recorded');
          console.log('Session duration:', duration, 'minutes');
          console.log('Exit location:', exitLocation);
          console.log('Complete session data:', sessionData);
          console.log('Coach state updated: isCheckedIn = false');
          console.log('=======================');
        },
        (error) => {
          console.log('Exit location failed:', error.message);
          const sessionData = {
            checkInTime: checkInTime?.toISOString() || null,
            checkOutTime: checkOutTime.toISOString(),
            durationMinutes: duration,
            sessionDate: checkOutTime.toDateString(),
            coachStatus: 'checked-out',
            exitLocation: null,
            exitLocationError: error.message
          };
          console.log('Session data (no exit location):', sessionData);
        }
      );
    } else {
      const sessionData = {
        checkInTime: checkInTime?.toISOString() || null,
        checkOutTime: checkOutTime.toISOString(),
        durationMinutes: duration,
        sessionDate: checkOutTime.toDateString(),
        coachStatus: 'checked-out',
        exitLocation: null,
        exitLocationError: 'Geolocation not supported'
      };
      console.log('Session data (no geolocation support):', sessionData);
    }
    
    setIsCheckedIn(false);
    setCheckInTime(null);
    
    toast({
      title: "Checked Out",
      description: `Session duration: ${duration} minutes with location tracking`,
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
      selectedBatch: selectedBatch,
      totalStudents: filteredStudents.length,
      presentCount: filteredStudents.filter(s => s.status === 'present').length,
      absentCount: filteredStudents.filter(s => s.status === 'absent').length,
      students: filteredStudents.map(student => ({
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
    console.log('Selected batch:', attendanceData.selectedBatch);
    console.log('Coach check-in time:', attendanceData.coachCheckIn);
    console.log('Total students (filtered):', attendanceData.totalStudents);
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
      description: `${attendanceData.presentCount} present, ${attendanceData.absentCount} absent${selectedBatch !== 'All Batches' ? ` in ${selectedBatch}` : ''}`,
    });
  };  const handleDrillUpdate = () => {
    if (newDrillTitle) {
      setDrillTitle(newDrillTitle);
    }
    if (newDrillImageFile) {
      setDrillImage(URL.createObjectURL(newDrillImageFile));
    }
    setIsUploadDialogOpen(false);
    toast({
      title: "Drill Updated",
      description: "The drill activity has been successfully updated.",
    });
  };

  const getStatusButtons = (student: Student) => {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => setStudentStatus(student.id, 'present')}
          className={`w-24 py-2 rounded-md font-semibold text-xs transition-all duration-300 ease-in-out ${
            student.status === 'present'
              ? 'bg-green-400 text-green-800'
              : 'bg-green-100 text-green-600'
          }`}
        >
          Present
        </Button>
        <Button
          onClick={() => setStudentStatus(student.id, 'absent')}
          className={`w-24 py-2 rounded-md font-semibold text-xs transition-all duration-300 ease-in-out ${
            student.status === 'absent'
              ? 'bg-red-400 text-red-800'
              : 'bg-red-100 text-red-600'
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
        <Card className="shadow-md rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-700">Session Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isCheckedIn ? (
              <Button
                onClick={handleCheckOut}
                className="w-full h-12 bg-gray-600 text-white hover:bg-gray-700 rounded-md font-semibold text-base tracking-wide transition-transform transform hover:scale-105"
              >
                Check Out
              </Button>
            ) : (
              <Button
                onClick={handleCheckIn}
                className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-md font-semibold text-base tracking-wide transition-transform transform hover:scale-105"
              >
                Check In
              </Button>
            )}
            {isCheckedIn && checkInTime && (
              <p className="text-sm text-gray-500 mt-3 text-center">
                Session started at {checkInTime.toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="shadow-md rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-700">Student Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Batch Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Batch</label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Batches">All Batches</SelectItem>
                  {uniqueBatches.map(batch => (
                    <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredStudents.map(student => (
                <div key={student.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{student.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{student.rollNumber} • {student.batch}</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {getStatusButtons(student)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Submit Attendance Button */}
            <div className="mt-6 pt-5 border-t border-gray-200">
              <Button
                onClick={handleSubmitAttendance}
                className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-semibold text-base tracking-wide transition-transform transform hover:scale-105"
              >
                Submit Attendance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Drill Activity Update */}
        <Card className="shadow-md rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-700">Drill Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-md font-semibold text-base tracking-wide transition-transform transform hover:scale-105">
                  Update Drill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Drill Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label htmlFor="drill-title" className="text-sm font-medium text-gray-700">Drill Title</label>
                    <Input 
                      id="drill-title"
                      placeholder="Enter new drill title"
                      value={newDrillTitle}
                      onChange={(e) => setNewDrillTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="drill-image" className="text-sm font-medium text-gray-700">Drill Image</label>
                    <Input 
                      id="drill-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && setNewDrillImageFile(e.target.files[0])}
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleDrillUpdate}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CoachDashboard;
