
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Edit3, Filter, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    }]
  );

  const batches = ['Morning Batch A', 'Evening Batch B', 'Weekend Batch C'];
  const filteredStudents = selectedBatch === 'all' ? students : students.filter(student => student.batch === selectedBatch);

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

  const handleSubmitAttendance = () => {
    const timestamp = new Date();
    const attendanceData = {
      submissionTime: timestamp.toISOString(),
      batch: selectedBatch,
      totalStudents: filteredStudents.length,
      presentStudents: filteredStudents.filter(s => s.status === 'present').length,
      absentStudents: filteredStudents.filter(s => s.status === 'absent').length,
      attendanceDetails: filteredStudents.map(student => ({
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        batch: student.batch,
        status: student.status
      }))
    };

    console.log('=== ATTENDANCE SUBMISSION ===');
    console.log('Submission timestamp:', timestamp.toISOString());
    console.log('Selected batch filter:', selectedBatch);
    console.log('Attendance summary:', {
      totalStudents: attendanceData.totalStudents,
      presentStudents: attendanceData.presentStudents,
      absentStudents: attendanceData.absentStudents
    });
    console.log('Detailed attendance data:', attendanceData.attendanceDetails);
    console.log('Full attendance submission data:', attendanceData);
    console.log('==============================');

    toast({
      title: "Attendance Submitted",
      description: "Student attendance has been successfully submitted"
    });
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
