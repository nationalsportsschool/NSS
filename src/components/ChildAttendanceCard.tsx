
import React from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  sport: string;
  coach: string;
}

interface ChildAttendanceCardProps {
  childName: string;
  rollNumber: string;
  attendanceRecords: AttendanceRecord[];
}

const ChildAttendanceCard = ({ childName, rollNumber, attendanceRecords }: ChildAttendanceCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Late</Badge>;
      default:
        return null;
    }
  };

  const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
  const attendancePercentage = attendanceRecords.length > 0 ? 
    Math.round((presentCount / attendanceRecords.length) * 100) : 0;

  console.log('=== CHILD ATTENDANCE CARD ===');
  console.log('Child:', childName, '| Roll Number:', rollNumber);
  console.log('Total Records:', attendanceRecords.length);
  console.log('Present Days:', presentCount);
  console.log('Attendance Percentage:', attendancePercentage + '%');
  console.log('Recent Records:', attendanceRecords.slice(0, 3));
  console.log('============================');

  return (
    <div className="bg-card shadow-sm border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-bold text-foreground">{childName}'s Attendance</h3>
              <p className="text-sm text-muted-foreground">Roll Number: {rollNumber}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{attendancePercentage}%</div>
            <div className="text-sm text-muted-foreground">Attendance Rate</div>
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        <h4 className="font-semibold text-foreground mb-4">Recent Attendance</h4>
        <div className="space-y-3">
          {attendanceRecords.slice(0, 5).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(record.status)}
                <div>
                  <div className="font-medium text-foreground">{record.date}</div>
                  <div className="text-sm text-muted-foreground">{record.sport} - Coach {record.coach}</div>
                </div>
              </div>
              {getStatusBadge(record.status)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildAttendanceCard;
