import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarkStudentAttendance, useMarkCoachAttendance, useStudents, useCreateDrill } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useCoachAuth } from '@/contexts/CoachAuthContext';
import { User, Mail, Phone, Calendar, Trophy } from 'lucide-react';

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
  const { coach, isLoggedIn, isLoading: authLoading } = useCoachAuth();
  
  // API mutations for attendance and drills
  const markStudentAttendanceMutation = useMarkStudentAttendance();
  const markCoachAttendanceMutation = useMarkCoachAttendance();
  const createDrillMutation = useCreateDrill();
  const { data: studentsData = [], isLoading: studentsLoading } = useStudents();
  
  const [drillImage, setDrillImage] = useState('https://images.unsplash.com/photo-1543351348-385b61a20366?w=400&h=225&fit=crop');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newDrillTitle, setNewDrillTitle] = useState('');
  const [newDrillImageFile, setNewDrillImageFile] = useState<File | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string>('All Batches');
  
  // Convert students data to local format with mock batch assignment
  const [students, setStudents] = useState<Student[]>([]);
  
  // Update students when data loads
  React.useEffect(() => {
    if (Array.isArray(studentsData) && studentsData.length > 0) {
      const batches = ['Morning Batch A', 'Evening Batch B', 'Afternoon Batch C'];
      const convertedStudents = (studentsData as any[]).slice(0, 10).map((student, index) => ({
        id: student.id.toString(),
        name: student.name,
        rollNumber: student.roll_number,
        batch: batches[index % batches.length],
        status: 'present' as const
      }));
      setStudents(convertedStudents);
    }
  }, [studentsData]);

  // Get unique batches from students
  const uniqueBatches = Array.from(new Set(students.map(student => student.batch)));
  
  // Filter students based on selected batch
  const filteredStudents = selectedBatch === 'All Batches' 
    ? students 
    : students.filter(student => student.batch === selectedBatch);

  // Loading state - show loading for both auth and students
  if (authLoading || studentsLoading) {
    return (
      <DashboardLayout
        title="Coach Dashboard"
        userType="coach"
        currentPath="/coach/dashboard"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i}>
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

  // Redirect if not authenticated
  if (!isLoggedIn || !coach) {
    return (
      <DashboardLayout
        title="Coach Dashboard"
        userType="coach"
        currentPath="/coach/dashboard"
      >
        <div className="flex items-center justify-center h-64">
          <Card className="p-6">
            <p className="text-lg text-gray-600">Please log in to access the coach dashboard.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

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

  const handleCheckOut = async () => {
    const checkOutTime = new Date();
    const duration = checkInTime ? 
      Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60)) : 0;
    const currentDate = checkOutTime.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    try {
      // Get exit location
      const exitLocation = await new Promise<any>((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
                address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
              });
            },
            (error) => {
              console.log('Exit location failed:', error.message);
              resolve(null);
            }
          );
        } else {
          resolve(null);
        }
      });

      // Save coach attendance to database
      const coachAttendanceData = {
        coachId: coach.id, // Use authenticated coach ID
        date: currentDate,
        status: 'Present',
        entryLocation: null, // You can implement entry location tracking in check-in
        exitLocation: exitLocation,
        totalHours: duration / 60, // Convert minutes to hours
        notes: `Session: ${duration} minutes. Check-in: ${checkInTime?.toLocaleTimeString() || 'N/A'}, Check-out: ${checkOutTime.toLocaleTimeString()}`
      };

      await markCoachAttendanceMutation.mutateAsync(coachAttendanceData);

      console.log('=== COACH ATTENDANCE SAVED TO DATABASE ===');
      console.log('Date:', currentDate);
      console.log('Check-in time:', checkInTime?.toISOString());
      console.log('Check-out time:', checkOutTime.toISOString());
      console.log('Session duration:', duration, 'minutes');
      console.log('Exit location:', exitLocation);
      console.log('=========================================');

      setIsCheckedIn(false);
      setCheckInTime(null);
      
      toast({
        title: "✅ Checked Out & Saved to Database",
        description: `Session duration: ${duration} minutes - Attendance saved to Supabase`,
      });

    } catch (error) {
      console.error('Error saving coach attendance:', error);
      
      // Still update UI state even if database save fails
      setIsCheckedIn(false);
      setCheckInTime(null);
      
      toast({
        title: "⚠️ Checked Out (Database Error)",
        description: `Session ended but failed to save to database. Duration: ${duration} minutes`,
        variant: "destructive",
      });
    }
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
  const handleSubmitAttendance = async () => {
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    try {
      // Mark attendance for each student
      const attendancePromises = filteredStudents.map(student => {
        const attendanceData = {
          studentId: parseInt(student.id), // Convert to number for backend
          date: currentDate,
          status: student.status === 'present' ? 'Present' : 'Absent', // Capitalize for backend
          batch: student.batch,
          notes: `Marked by coach on ${new Date().toLocaleString()}`
        };

        return markStudentAttendanceMutation.mutateAsync(attendanceData);
      });

      // Wait for all attendance records to be saved
      await Promise.all(attendancePromises);

      const presentCount = filteredStudents.filter(s => s.status === 'present').length;
      const absentCount = filteredStudents.filter(s => s.status === 'absent').length;

      console.log('=== ATTENDANCE SAVED TO DATABASE ===');
      console.log('Date:', currentDate);
      console.log('Batch:', selectedBatch);
      console.log('Present students:', presentCount);
      console.log('Absent students:', absentCount);
      console.log('Total students:', filteredStudents.length);
      console.log('====================================');

      toast({
        title: "✅ Attendance Saved to Database",
        description: `${presentCount} present, ${absentCount} absent - Data saved to Supabase`,
      });

    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: "❌ Error Saving Attendance",
        description: "Failed to save attendance to database. Please try again.",
        variant: "destructive",
      });
    }
  };  const handleDrillUpdate = async () => {
    try {
      if (!newDrillTitle.trim()) {
        toast({
          title: "Error",
          description: "Please provide a drill title.",
          variant: "destructive",
        });
        return;
      }

      const drillData = {
        title: newDrillTitle,
        description: `Drill activity for ${selectedBatch} by ${coach.name}`,
        date: new Date().toISOString().split('T')[0],
        sport: coach.sports[0] || 'Football', // Use coach's primary sport
        participants: students.filter(s => s.status === 'present').length || 1,
        instructor_id: coach.id, // Use authenticated coach ID
        duration: '45 minutes'
      };

      await createDrillMutation.mutateAsync({
        drillData,
        imageFile: newDrillImageFile || undefined
      });

      // Update local state for immediate feedback
      if (newDrillTitle) {
        setDrillTitle(newDrillTitle);
      }
      if (newDrillImageFile) {
        setDrillImage(URL.createObjectURL(newDrillImageFile));
      }

      setIsUploadDialogOpen(false);
      setNewDrillTitle('');
      setNewDrillImageFile(null);

      toast({
        title: "Drill Created",
        description: "The drill activity has been successfully created and saved.",
      });
    } catch (error) {
      console.error('Failed to create drill:', error);
      toast({
        title: "Error",
        description: "Failed to create drill activity. Please try again.",
        variant: "destructive",
      });
    }
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
      title={`Welcome, ${coach.name}`}
      userType="coach"
      currentPath="/coach/dashboard"
    >
      <div className="space-y-6">
        {/* Coach Profile Section */}
        <Card className="shadow-md rounded-lg border-l-4 border-l-blue-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-700 flex items-center gap-2">
              <User className="h-5 w-5" />
              Coach Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{coach.name}</p>
                </div>
              </div>
              
              {coach.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{coach.email}</p>
                  </div>
                </div>
              )}
              
              {coach.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{coach.phone}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Sports</p>
                  <p className="font-semibold">{coach.sports.join(', ')}</p>
                </div>
              </div>
              
              {coach.experience_years && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-semibold">{coach.experience_years} years</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${coach.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold">{coach.status}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
