import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UserPlus, CreditCard, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import StudentRegistrationForm from '@/components/StudentRegistrationForm';
import CoachRegistrationForm from '@/components/CoachRegistrationForm';
import ParentCredentialsCard from '@/components/ParentCredentialsCard';
import StudentsTab from '@/components/admin/tabs/StudentsTab';
import PaymentsTab from '@/components/admin/tabs/PaymentsTab';
import AttendanceTab from '@/components/admin/tabs/AttendanceTab';

// Import API hooks instead of mock data
import {
  useStudents,
  usePaymentLogs,
  useStudentAttendance,
  useCoachAttendance,
} from '@/lib/api';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('students');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCoachRegisterForm, setShowCoachRegisterForm] = useState(false);
  const [newParentCredentials, setNewParentCredentials] = useState<{ username: string; password: string } | null>(null);
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 10),
    to: addDays(new Date(2025, 5, 11), 0),
  });

  // Fetch real data using API hooks
  const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useStudents();
  const { data: paymentLogsData, isLoading: paymentsLoading, error: paymentsError, refetch: refetchPayments } = usePaymentLogs();
  const { 
    data: studentAttendanceData, 
    isLoading: studentAttendanceLoading, 
    error: studentAttendanceError 
  } = useStudentAttendance(
    dateRange?.from?.toISOString().split('T')[0],
    dateRange?.to?.toISOString().split('T')[0]
  );
  const { 
    data: coachAttendanceData, 
    isLoading: coachAttendanceLoading, 
    error: coachAttendanceError 
  } = useCoachAttendance(
    dateRange?.from?.toISOString().split('T')[0],
    dateRange?.to?.toISOString().split('T')[0]
  );

  // Ensure data is arrays with fallbacks
  const students = Array.isArray(studentsData) ? studentsData : [];
  const paymentLogs = Array.isArray(paymentLogsData) ? paymentLogsData : [];
  
  // Transform attendance data to include name field directly
  const studentAttendance = Array.isArray(studentAttendanceData) 
    ? studentAttendanceData.map((record: any) => ({
        ...record,
        name: record.student?.name || 'Unknown Student',
        sport: record.student?.sport || 'Unknown Sport'
      }))
    : [];
    
  const coachAttendance = Array.isArray(coachAttendanceData) 
    ? coachAttendanceData.map((record: any) => ({
        ...record,
        name: record.coach?.name || 'Unknown Coach',
        sport: record.coach?.sport || 'Unknown Sport'
      }))
    : [];

  const generateStudentReport = () => {
    if (studentsLoading) {
      toast({
        title: "Loading",
        description: "Please wait while students data is being loaded.",
      });
      return;
    }

    if (studentsError || !students.length) {
      toast({
        title: "Error",
        description: "Unable to generate report. No student data available.",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ["ID", "Name", "Sport", "Group", "Payment Status", "Last Payment"];
    const tableRows: any[][] = [];

    students.forEach(student => {
      const studentData = [
        student.id,
        student.name,
        student.sport,
        student.group_level,
        student.payment_status === 'paid' ? 'Paid' : student.payment_status === 'not_paid' ? 'Unpaid' : 'Upcoming',
        student.last_payment || 'N/A'
      ];
      tableRows.push(studentData);
    });

    doc.setFontSize(20);
    doc.text("Student Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 30);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
    });
    
    doc.save("student-report.pdf");
    
    toast({
      title: "Report Generated",
      description: "Student report has been downloaded successfully.",
    });
  };

  const handleRegisterNewStudent = () => {
    setShowRegisterForm(true);
  };
  
  const handleRegisterNewCoach = () => {
    setShowCoachRegisterForm(true);
  };
  
  const handleRegistrationSuccess = (credentials: { username: string; password: string }) => {
    setNewParentCredentials(credentials);
    setShowRegisterForm(false);
  };

  const handleCoachRegistrationSuccess = () => {
    setShowCoachRegisterForm(false);
    // Optionally refresh coaches data when API is available
    toast({
      title: "Success",
      description: "Coach has been successfully added to the system.",
    });
  };

  const generateAttendanceReport = () => {
    if (studentAttendanceLoading || coachAttendanceLoading) {
      toast({
        title: "Loading",
        description: "Please wait while attendance data is being loaded.",
      });
      return;
    }

    if (studentAttendanceError || coachAttendanceError) {
      toast({
        title: "Error", 
        description: "Unable to generate attendance report.",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    doc.text("Student Attendance Report", 14, 22);
    autoTable(doc, {
      head: [['ID', 'Name', 'Date', 'Status', 'Batch']],
      body: (studentAttendance as any[]).map(s => [
        s.id, 
        s.name, 
        s.date, 
        s.status, 
        s.batch || 'N/A'
      ]),
      startY: 35,
    });
    doc.addPage();
    doc.text("Coach Attendance Report", 14, 22);
    autoTable(doc, {
      head: [['ID', 'Name', 'Date', 'Status', 'Role']],
      body: (coachAttendance as any[]).map(c => [
        c.id, 
        c.name, 
        c.date, 
        c.status, 
        c.sport || 'General'
      ]),
      startY: 35,
    });
    doc.save("attendance-report.pdf");
    toast({
      title: "Report Generated",
      description: "Attendance report has been downloaded successfully.",
    });
  };

  return (
    <DashboardLayout
      title="Admin Dashboard"
      userType="admin"
      currentPath="/admin/dashboard"
    >
      {showRegisterForm ? (
        <StudentRegistrationForm onBack={() => setShowRegisterForm(false)} onSuccess={handleRegistrationSuccess} />
      ) : showCoachRegisterForm ? (
        <CoachRegistrationForm onBack={() => setShowCoachRegisterForm(false)} onSuccess={handleCoachRegistrationSuccess} />
      ) : newParentCredentials ? (
        <ParentCredentialsCard credentials={newParentCredentials} onBack={() => setNewParentCredentials(null)} />
      ) : (        <>
          <Tabs defaultValue="students" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">            <TabsList className="grid w-full h-auto grid-cols-3 gap-1 sm:gap-2 md:gap-4 p-0 bg-transparent border-none">
              <TabsTrigger value="students" className="flex flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-semibold">Students</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-semibold">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-semibold">Attendance</span>
              </TabsTrigger>
            </TabsList>
            {selectedTab === 'students' && (
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 shrink-0"
                onClick={handleRegisterNewCoach}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                New Coach
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white shrink-0"
                onClick={handleRegisterNewStudent}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                New Student
              </Button>
            </div>
          )}
            <TabsContent value="students" className="space-y-4">
              <StudentsTab students={students} />
            </TabsContent>            <TabsContent value="payments" className="space-y-4">
              {paymentsLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading payment data...</p>
                  </div>
                </div>
              ) : paymentsError ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <p className="text-red-600 mb-2">Error loading payment data</p>
                    <p className="text-sm text-muted-foreground">{paymentsError.message}</p>
                  </div>
                </div>
              ) : (
                <PaymentsTab paymentLogs={paymentLogs} onRefresh={refetchPayments} />
              )}
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <AttendanceTab
                dateRange={dateRange}
                setDateRange={setDateRange}
                generateAttendanceReport={generateAttendanceReport}
                studentAttendance={studentAttendance}
                coachAttendance={coachAttendance}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
