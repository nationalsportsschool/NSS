
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Edit3, Filter, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMarkStudentAttendance, useStudents } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  batch: string;
  status: 'present' | 'absent';
}

const StudentAttendanceManager = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const { toast } = useToast();
  const markStudentAttendanceMutation = useMarkStudentAttendance();
  const { data: studentsData = [], isLoading: studentsLoading } = useStudents();
  
  const [students, setStudents] = useState<Student[]>([]);

  // Convert students data to local format with mock batch assignment
  React.useEffect(() => {
    if (Array.isArray(studentsData) && studentsData.length > 0) {
      const batches = ['Morning Batch A', 'Evening Batch B', 'Weekend Batch C'];
      const convertedStudents = (studentsData as any[]).slice(0, 15).map((student, index) => ({
        id: student.id.toString(),
        name: student.name,
        rollNumber: student.roll_number,
        batch: batches[index % batches.length],
        status: 'present' as const
      }));
      setStudents(convertedStudents);
    }
  }, [studentsData]);

  const batches = ['Morning Batch A', 'Evening Batch B', 'Weekend Batch C'];
  const filteredStudents = selectedBatch === 'all' ? students : students.filter(student => student.batch === selectedBatch);

  // Loading state
  if (studentsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const toggleStudentStatus = (studentId: string) => {
    console.log('Toggling student status for student ID:', studentId);
    
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const newStatus: 'present' | 'absent' = student.status === 'present' ? 'absent' : 'present';
        console.log(`Student ${student.name} (${student.rollNumber}) status changed from ${student.status} to ${newStatus}`);
        return { ...student, status: newStatus };
      }
      return student;
    }));
  };

  const handleBatchChange = (batch: string) => {
    console.log('Batch filter changed to:', batch);
    setSelectedBatch(batch);
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
          notes: `Marked via StudentAttendanceManager on ${new Date().toLocaleString()}`
        };

        return markStudentAttendanceMutation.mutateAsync(attendanceData);
      });

      // Wait for all attendance records to be saved
      await Promise.all(attendancePromises);

      const presentCount = filteredStudents.filter(s => s.status === 'present').length;
      const absentCount = filteredStudents.filter(s => s.status === 'absent').length;

      console.log('=== ATTENDANCE SAVED TO DATABASE ===');
      console.log('Date:', currentDate);
      console.log('Batch filter:', selectedBatch);
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
  };

  const getStatusButton = (status: string, onClick: () => void) => {
    switch (status) {
      case 'present':
        return (
          <Button 
            onClick={onClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-lg font-medium h-8"
          >
            Present
          </Button>
        );
      case 'absent':
        return (
          <Button 
            onClick={onClick}
            variant="destructive"
            className="px-3 py-1 rounded-lg font-medium h-8"
          >
            Absent
          </Button>
        );
      default:
        return (
          <Button 
            onClick={onClick}
            variant="secondary"
            className="px-3 py-1 rounded-lg font-medium h-8"
          >
            Unknown
          </Button>
        );
    }
  };

  return (
    <div className="bg-card shadow-sm border border-border overflow-hidden rounded-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">Student Attendance</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-5 py-5 space-y-5">
        {/* Batch Filter */}
        <div className="bg-secondary p-4 rounded-none">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={selectedBatch} onValueChange={handleBatchChange}>
              <SelectTrigger className="flex-1 h-12 rounded-lg border-border bg-card">
                <SelectValue placeholder="Filter by batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batches.map(batch => (
                  <SelectItem key={batch} value={batch}>
                    {batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-3">
          {filteredStudents.map(student => (
            <div key={student.id} className="bg-secondary p-4 border border-border rounded-none">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-foreground text-base truncate">{student.name}</div>
                      <div className="text-sm text-muted-foreground truncate font-medium">{student.batch}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  {getStatusButton(student.status, () => toggleStudentStatus(student.id))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            onClick={handleSubmitAttendance}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg font-medium"
          >
            <Send className="h-5 w-5 mr-2" />
            Submit Attendance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceManager;
