import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UserPlus, CreditCard, MessageSquare, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import StudentRegistrationForm from '@/components/StudentRegistrationForm';
import ParentCredentialsCard from '@/components/ParentCredentialsCard';
import StudentsTab from '@/components/admin/tabs/StudentsTab';
import PaymentsTab from '@/components/admin/tabs/PaymentsTab';
import WhatsAppTab from '@/components/admin/tabs/WhatsAppTab';
import AttendanceTab from '@/components/admin/tabs/AttendanceTab';

import {
  mockStudents,
  mockPaymentLogs,
  mockWhatsAppLogs,
  mockStudentAttendance,
  mockCoachAttendance,
} from '@/data/mockData';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('students');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newParentCredentials, setNewParentCredentials] = useState<{ username: string; password: string } | null>(null);
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 10),
    to: addDays(new Date(2025, 5, 11), 0),
  });
  const generateStudentReport = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Name", "Sport", "Group", "Payment Status", "Last Payment"];
    const tableRows: any[][] = [];

    mockStudents.forEach(student => {
      const studentData = [
        student.id,
        student.name,
        student.sport,
        student.group,
        student.paymentStatus === 'paid' ? 'Paid' : student.paymentStatus === 'not_paid' ? 'Unpaid' : 'Upcoming',
        student.lastPayment
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
  const handleRegistrationSuccess = (credentials: { username: string; password: string }) => {
    setNewParentCredentials(credentials);
    setShowRegisterForm(false);
  };

  const generateAttendanceReport = () => {
    const doc = new jsPDF();
    doc.text("Student Attendance Report", 14, 22);
    autoTable(doc, {
      head: [['ID', 'Name', 'Date', 'Status', 'Batch']],
      body: mockStudentAttendance.map(s => [s.id, s.name, s.date, s.status, s.batch]),
      startY: 35,
    });
    doc.addPage();
    doc.text("Coach Attendance Report", 14, 22);
    autoTable(doc, {
      head: [['ID', 'Name', 'Date', 'Status', 'Role']],
      body: mockCoachAttendance.map(c => [c.id, c.name, c.date, c.status, c.batch]),
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
      ) : newParentCredentials ? (
        <ParentCredentialsCard credentials={newParentCredentials} onBack={() => setNewParentCredentials(null)} />
      ) : (        <>
          <Tabs defaultValue="students" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="grid w-full h-auto grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-0 bg-transparent border-none">
              <TabsTrigger value="students" className="flex flex-row items-center justify-center gap-2 p-3 rounded-lg">
                <Users className="h-5 w-5" />
                <span className="text-sm font-semibold">Students</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex flex-row items-center justify-center gap-2 p-3 rounded-lg">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-semibold">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex flex-row items-center justify-center gap-2 p-3 rounded-lg">
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm font-semibold">WhatsApp</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex flex-row items-center justify-center gap-2 p-3 rounded-lg">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-sm font-semibold">Attendance</span>
              </TabsTrigger>
            </TabsList>
            {selectedTab === 'students' && (
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
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
              <StudentsTab students={mockStudents} />
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <PaymentsTab paymentLogs={mockPaymentLogs} />
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-4">
              <WhatsAppTab whatsAppLogs={mockWhatsAppLogs} />
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <AttendanceTab
                dateRange={dateRange}
                setDateRange={setDateRange}
                generateAttendanceReport={generateAttendanceReport}
                studentAttendance={mockStudentAttendance}
                coachAttendance={mockCoachAttendance}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
