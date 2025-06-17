import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Shield, MessageSquare, Calendar as CalendarIcon, UserPlus, CreditCard, Phone, Users, MapPin, Clock, Download, Activity, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import StudentRegistrationForm from '@/components/StudentRegistrationForm';
import ParentCredentialsCard from '@/components/ParentCredentialsCard';
import DrillActivityCard from '@/components/DrillActivityCard';
import AdminAnalytics from '@/components/AdminAnalytics';

// Extended mock data with around 40 records each
const generateMockStudents = () => {
  const students = [];
  const sports = ['Soccer', 'Basketball', 'Tennis', 'Swimming'];
  const groups = ['Beginners', 'Intermediate', 'Advanced'];
  const paymentStatuses = ['paid', 'not_paid', 'upcoming'];
  const firstNames = ['John', 'Sarah', 'Mike', 'Emma', 'Alex', 'Lisa', 'David', 'Sophie', 'Ryan', 'Anna', 'Kevin', 'Rachel', 'Tom', 'Grace', 'Mark', 'Julia', 'Chris', 'Nina', 'Ben', 'Kate'];
  const lastNames = ['Smith', 'Johnson', 'Davis', 'Wilson', 'Brown', 'Chen', 'Garcia', 'Miller', 'Taylor', 'Anderson', 'White', 'Martinez', 'Lee', 'Thompson', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young'];
  for (let i = 0; i < 40; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length)];
    const sport = sports[i % sports.length];
    const group = groups[i % groups.length];
    const paymentStatus = paymentStatuses[i % paymentStatuses.length];
    students.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      sport,
      feePlan: sport === 'Tennis' || sport === 'Swimming' ? 'Monthly - $200' : sport === 'Soccer' ? 'Monthly - $150' : 'Weekly - $40',
      paymentStatus,
      parentContact: `+123456${String(7890 + i).padStart(4, '0')}`,
      lastPayment: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
      group
    });
  }
  return students;
};
const generateMockPaymentLogs = () => {
  const logs = [];
  const statuses = ['paid', 'not_paid', 'upcoming'];
  const amounts = ['$150', '$40', '$200', '$180'];
  for (let i = 0; i < 40; i++) {
    logs.push({
      id: i + 1,
      studentName: mockStudents[i].name,
      amount: amounts[i % amounts.length],
      status: statuses[i % statuses.length],
      date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
      method: 'Stripe'
    });
  }
  return logs;
};
const generateMockWhatsAppLogs = () => {
  const logs = [];
  const messageTypes = ['Payment reminder sent', 'Session reminder sent', 'Schedule update notification', 'Welcome message sent', 'Attendance notification', 'Monthly report sent'];
  const statuses = ['delivered', 'pending'];
  for (let i = 0; i < 40; i++) {
    logs.push({
      id: i + 1,
      studentName: mockStudents[i].name,
      message: messageTypes[i % messageTypes.length],
      status: statuses[i % statuses.length],
      date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0]
    });
  }
  return logs;
};
const generateMockCoachAttendance = () => {
  const attendance = [];
  const coaches = ['Coach Michael', 'Coach Sarah', 'Coach David', 'Coach Lisa', 'Coach James', 'Coach Emma', 'Coach Ryan', 'Coach Maria'];
  const sports = ['Soccer', 'Basketball', 'Tennis', 'Swimming'];
  const batches = ['Advanced Soccer', 'Intermediate Basketball', 'Beginners Tennis', 'Advanced Swimming'];
  const locations = ['Main Gate', 'Side Gate', 'Pool Entrance', 'Court Entrance'];
  for (let i = 0; i < 40; i++) {
    const coach = coaches[i % coaches.length];
    const sport = sports[i % sports.length];
    const batch = batches[i % batches.length];
    const entryLocation = locations[i % locations.length];
    const exitLocation = locations[(i + 1) % locations.length];
    attendance.push({
      id: i + 1,
      coachName: coach,
      date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
      entryTime: `${String(7 + Math.floor(i / 5)).padStart(2, '0')}:${String(Math.floor(Math.random() * 6) * 10).padStart(2, '0')} AM`,
      entryLocation,
      exitTime: `${String(4 + Math.floor(i / 8)).padStart(2, '0')}:${String(Math.floor(Math.random() * 6) * 10).padStart(2, '0')} PM`,
      exitLocation,
      sport,
      batch
    });
  }
  return attendance;
};
const mockStudents = generateMockStudents();
const mockPaymentLogs = generateMockPaymentLogs();
const mockWhatsAppLogs = generateMockWhatsAppLogs();
const mockCoachAttendance = generateMockCoachAttendance();

// Mock data for drill activities
const mockDrillActivities = [{
  id: 1,
  title: 'Advanced Soccer Dribbling Drills',
  description: 'Intensive dribbling practice focusing on ball control, quick turns, and speed. Students practiced cone weaving and 1v1 scenarios.',
  image: 'photo-1431576901776-e539bd916ba2',
  date: '2024-01-24',
  sport: 'Soccer',
  participants: 12,
  duration: '45 mins',
  instructor: 'Coach Michael'
}, {
  id: 2,
  title: 'Basketball Shooting Fundamentals',
  description: 'Free throw practice and 3-point shooting drills. Focus on proper form, follow-through, and consistency.',
  image: 'photo-1546519638-68e109498ffc',
  date: '2024-01-23',
  sport: 'Basketball',
  participants: 8,
  duration: '60 mins',
  instructor: 'Coach Sarah'
}, {
  id: 3,
  title: 'Tennis Backhand Technique',
  description: 'Working on two-handed backhand strokes, footwork positioning, and cross-court rallies.',
  image: 'photo-1622279457486-62dcc4a431d6',
  date: '2024-01-22',
  sport: 'Tennis',
  participants: 6,
  duration: '50 mins',
  instructor: 'Coach David'
}, {
  id: 4,
  title: 'Swimming Stroke Improvement',
  description: 'Freestyle and backstroke technique refinement. Focus on breathing patterns and stroke efficiency.',
  image: 'photo-1530549387789-4c1017266635',
  date: '2024-01-21',
  sport: 'Swimming',
  participants: 10,
  duration: '55 mins',
  instructor: 'Coach Lisa'
}, {
  id: 5,
  title: 'Soccer Tactical Positioning',
  description: 'Team formation drills, defensive positioning, and offensive strategies for game situations.',
  image: 'photo-1551698618-1dfe5d97d256',
  date: '2024-01-20',
  sport: 'Soccer',
  participants: 15,
  duration: '70 mins',
  instructor: 'Coach Michael'
}, {
  id: 6,
  title: 'Basketball Defense Drills',
  description: 'Man-to-man defense, help defense concepts, and defensive slides practice.',
  image: 'photo-1505666287802-931dc83948e9',
  date: '2024-01-19',
  sport: 'Basketball',
  participants: 9,
  duration: '40 mins',
  instructor: 'Coach Sarah'
}];

// Extended mock data for 45 days attendance
const generateMockAttendanceData = () => {
  const students = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emma Wilson', 'Alex Brown', 'Lisa Chen', 'David Wilson', 'Sophie Taylor'];
  const sports = ['Soccer', 'Basketball', 'Tennis', 'Swimming'];
  const statuses = ['present', 'absent', 'late'];
  const data = [];
  for (let i = 0; i < 45; i++) {
    const date = subDays(new Date(), i);
    students.forEach((student, index) => {
      // Skip weekends for more realistic data
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        data.push({
          id: `${index}-${i}`,
          studentName: student,
          date: format(date, 'yyyy-MM-dd'),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          sport: sports[index % sports.length],
          batch: `${sports[index % sports.length]} Training`
        });
      }
    });
  }
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
const mockStudentAttendanceExtended = generateMockAttendanceData();
const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [parentCredentials, setParentCredentials] = useState(null);
  const [attendanceView, setAttendanceView] = useState('student');
  const [showDrillHistory, setShowDrillHistory] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(),
    to: new Date()
  });
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const {
    toast
  } = useToast();

  // Filter attendance data based on date range
  const filteredAttendanceData = useMemo(() => {
    return mockStudentAttendanceExtended.filter(record => {
      const recordDate = new Date(record.date);
      return isWithinInterval(recordDate, {
        start: dateRange.from,
        end: dateRange.to
      });
    });
  }, [dateRange]);
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">Paid</Badge>;
      case 'not_paid':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-xs">Not Paid</Badge>;
      case 'upcoming':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-xs">Upcoming</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };
  const getAttendanceStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-xs">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-xs">Late</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };
  const downloadAttendancePDF = () => {
    const pdf = new jsPDF();

    // Add title
    pdf.setFontSize(16);
    pdf.text('Student Attendance Report', 20, 20);

    // Add date range
    pdf.setFontSize(12);
    pdf.text(`Period: ${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`, 20, 35);

    // Prepare data for table
    const tableData = filteredAttendanceData.map(record => [record.studentName, format(new Date(record.date), 'MMM dd, yyyy'), record.status, record.sport, record.batch]);

    // Add table using autoTable
    autoTable(pdf, {
      head: [['Student Name', 'Date', 'Status', 'Sport', 'Batch']],
      body: tableData,
      startY: 45,
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: [220, 53, 69]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Add summary
    const totalRecords = filteredAttendanceData.length;
    const presentCount = filteredAttendanceData.filter(r => r.status === 'present').length;
    const absentCount = filteredAttendanceData.filter(r => r.status === 'absent').length;
    const lateCount = filteredAttendanceData.filter(r => r.status === 'late').length;
    const finalY = (pdf as any).lastAutoTable.finalY + 10;
    pdf.text('Summary:', 20, finalY);
    pdf.text(`Total Records: ${totalRecords}`, 20, finalY + 10);
    pdf.text(`Present: ${presentCount}`, 20, finalY + 20);
    pdf.text(`Absent: ${absentCount}`, 20, finalY + 30);
    pdf.text(`Late: ${lateCount}`, 20, finalY + 40);

    // Save the PDF
    pdf.save(`attendance-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast({
      title: "PDF Downloaded",
      description: "Attendance report has been downloaded successfully."
    });
  };
  const downloadPaymentsPDF = () => {
    const pdf = new jsPDF();

    // Add header with company branding
    pdf.setFillColor(220, 53, 69); // Red background
    pdf.rect(0, 0, 210, 25, 'F');

    // Add title
    pdf.setTextColor(255, 255, 255); // White text
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT REPORT', 20, 15);

    // Add report date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 150, 15);

    // Reset text color for body
    pdf.setTextColor(0, 0, 0);

    // Add summary section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Payment Summary', 20, 40);

    // Calculate totals
    const totalPayments = mockPaymentLogs.length;
    const paidCount = mockPaymentLogs.filter(log => log.status === 'paid').length;
    const notPaidCount = mockPaymentLogs.filter(log => log.status === 'not_paid').length;
    const upcomingCount = mockPaymentLogs.filter(log => log.status === 'upcoming').length;

    // Calculate total revenue
    const totalRevenue = mockPaymentLogs.filter(log => log.status === 'paid').reduce((sum, log) => sum + parseInt(log.amount.replace('$', '')), 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Payments: ${totalPayments}`, 20, 50);
    pdf.text(`Paid: ${paidCount}`, 20, 57);
    pdf.text(`Not Paid: ${notPaidCount}`, 20, 64);
    pdf.text(`Upcoming: ${upcomingCount}`, 20, 71);
    pdf.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, 20, 78);

    // Prepare data for detailed table
    const tableData = mockPaymentLogs.map(log => [log.studentName, log.amount, log.status.charAt(0).toUpperCase() + log.status.slice(1).replace('_', ' '), format(new Date(log.date), 'MMM dd, yyyy'), log.method]);

    // Add detailed payments table
    autoTable(pdf, {
      head: [['Student Name', 'Amount', 'Status', 'Date', 'Method']],
      body: tableData,
      startY: 90,
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [220, 53, 69],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        textColor: [50, 50, 50]
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      columnStyles: {
        0: {
          cellWidth: 50
        },
        // Student Name
        1: {
          cellWidth: 25,
          halign: 'right'
        },
        // Amount
        2: {
          cellWidth: 30,
          halign: 'center'
        },
        // Status
        3: {
          cellWidth: 30,
          halign: 'center'
        },
        // Date
        4: {
          cellWidth: 25,
          halign: 'center'
        } // Method
      }
    });

    // Add footer
    const pageHeight = pdf.internal.pageSize.height;
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text('This is a computer-generated report', 20, pageHeight - 15);
    pdf.text(`Page 1 of 1`, 180, pageHeight - 15);

    // Save the PDF
    pdf.save(`payment-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast({
      title: "PDF Downloaded",
      description: "Payment report has been downloaded successfully."
    });
  };
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setDateRange(prev => ({
        ...prev,
        from: date
      }));
      setIsStartDatePickerOpen(false);
    }
  };
  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setDateRange(prev => ({
        ...prev,
        to: date
      }));
      setIsEndDatePickerOpen(false);
    }
  };
  const handleAddStudent = () => {
    setCurrentView('registration');
  };
  const handleRegistrationSuccess = (credentials: {
    username: string;
    password: string;
  }) => {
    setParentCredentials(credentials);
    setCurrentView('credentials');
  };
  const handleViewAnalytics = () => {
    setCurrentView('analytics');
  };
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setParentCredentials(null);
  };
  if (currentView === 'registration') {
    return <StudentRegistrationForm onBack={handleBackToDashboard} onSuccess={handleRegistrationSuccess} />;
  }
  if (currentView === 'credentials' && parentCredentials) {
    return <ParentCredentialsCard credentials={parentCredentials} onBack={handleBackToDashboard} />;
  }
  if (currentView === 'analytics') {
    return <AdminAnalytics onBack={handleBackToDashboard} />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 py-4 max-w-md sm:max-w-2xl md:max-4xl lg:max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-600 flex-shrink-0" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          {/* Analytics Button - Only show on larger screens */}
          <div className="hidden lg:block">
            <Button onClick={handleViewAnalytics} className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>View Analytics</span>
            </Button>
          </div>
        </div>

        {/* Mobile-optimized Tabs */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1 sm:grid-cols-4">
            <TabsTrigger value="students" className="text-xs px-2 py-2.5 data-[state=active]:bg-white">
              <Users className="h-3 w-3 mr-1" />
              Students
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-xs px-2 py-2.5 data-[state=active]:bg-white">
              <CreditCard className="h-3 w-3 mr-1" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="text-xs px-2 py-2.5 data-[state=active]:bg-white">
              <MessageSquare className="h-3 w-3 mr-1" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs px-2 py-2.5 data-[state=active]:bg-white">
              <CalendarIcon className="h-3 w-3 mr-1" />
              Attendance
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Student Management</CardTitle>
                    
                  </div>
                  <Button onClick={handleAddStudent} size="sm" className="bg-red-600 hover:bg-red-700 w-full sm:w-auto px-0 mx-0">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-3 sm:px-6">
                <div className="text-xs text-gray-500 mb-3">
                  Showing 10 of {mockStudents.length} students
                </div>
                {mockStudents.slice(0, 10).map(student => <Card key={student.id} className="p-3 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm pr-2">{student.name}</h3>
                      {getPaymentStatusBadge(student.paymentStatus)}
                    </div>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between items-center">
                        <span>Sport:</span>
                        <span className="font-medium">{student.sport}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Group:</span>
                        <span className="font-medium">{student.group}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Fee Plan:</span>
                        <span className="font-medium text-right">{student.feePlan}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Parent:</span>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{student.parentContact}</span>
                          <Phone className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </Card>)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div>
                    <CardTitle className="flex items-center text-base sm:text-lg">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Logs
                    </CardTitle>
                    
                  </div>
                  <Button onClick={downloadPaymentsPDF} size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-3 sm:px-6">
                <div className="text-xs text-gray-500 mb-3">
                  Showing 10 of {mockPaymentLogs.length} payment records
                </div>
                {mockPaymentLogs.slice(0, 10).map(log => <Card key={log.id} className="p-3 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm pr-2">{log.studentName}</h3>
                      {getPaymentStatusBadge(log.status)}
                    </div>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between items-center">
                        <span>Amount:</span>
                        <span className="font-medium text-green-600">{log.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Date:</span>
                        <span className="font-medium">{log.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Method:</span>
                        <span className="font-medium">{log.method}</span>
                      </div>
                    </div>
                  </Card>)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  WhatsApp Messages
                </CardTitle>
                
              </CardHeader>
              <CardContent className="space-y-3 px-3 sm:px-6">
                
                {mockWhatsAppLogs.slice(0, 10).map(log => <Card key={log.id} className="p-3 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm pr-2">{log.studentName}</h3>
                      <Badge variant={log.status === 'delivered' ? 'default' : 'secondary'} className="text-xs">
                        {log.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Message:</span>
                        <p className="mt-1 leading-relaxed">{log.message}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Date:</span>
                        <span className="font-medium">{log.date}</span>
                      </div>
                    </div>
                  </Card>)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="space-y-4">
                  <div>
                    <CardTitle className="flex items-center text-base sm:text-lg">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Attendance Management
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Select date range to view attendance records
                    </CardDescription>
                  </div>
                  
                  {/* Date Range Picker Controls - Improved Layout */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                        <Popover open={isStartDatePickerOpen} onOpenChange={setIsStartDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full h-11 justify-start text-sm">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {format(dateRange.from, 'MMM dd, yyyy')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={dateRange.from} onSelect={handleStartDateSelect} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">End Date</label>
                        <Popover open={isEndDatePickerOpen} onOpenChange={setIsEndDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full h-11 justify-start text-sm">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {format(dateRange.to, 'MMM dd, yyyy')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={dateRange.to} onSelect={handleEndDateSelect} disabled={date => date < dateRange.from} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Improved Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button onClick={() => setShowDrillHistory(!showDrillHistory)} variant={showDrillHistory ? "default" : "outline"} className="h-11 text-sm font-medium">
                        <Activity className="h-4 w-4 mr-2" />
                        Drill History
                      </Button>
                      
                      <Button onClick={downloadAttendancePDF} className="h-11 bg-green-600 hover:bg-green-700 text-sm font-medium">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>

                  {/* Student/Coach Toggle - Only show when not in drill history */}
                  {!showDrillHistory && <div className="grid grid-cols-2 gap-3">
                      <Button variant={attendanceView === 'student' ? 'default' : 'outline'} onClick={() => setAttendanceView('student')} className="h-11 text-sm font-medium">
                        <Users className="h-4 w-4 mr-2" />
                        Students
                      </Button>
                      <Button variant={attendanceView === 'coach' ? 'default' : 'outline'} onClick={() => setAttendanceView('coach')} className="h-11 text-sm font-medium">
                        <Clock className="h-4 w-4 mr-2" />
                        Coaches
                      </Button>
                    </div>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-3 sm:px-6">
                {showDrillHistory ? <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Recent Drill Activities</h3>
                      <span className="text-xs text-gray-500">({mockDrillActivities.length} activities)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mockDrillActivities.map(activity => <DrillActivityCard key={activity.id} activity={activity} />)}
                    </div>
                  </div> : <>
                    {attendanceView === 'student' ? <>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500">
                            Showing 20 of {filteredAttendanceData.length} records
                          </span>
                        </div>
                        {filteredAttendanceData.slice(0, 20).map(record => <Card key={record.id} className="p-3 border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{record.studentName}</h3>
                                <p className="text-xs text-gray-600">{format(new Date(record.date), 'MMM dd, yyyy')}</p>
                              </div>
                              {getAttendanceStatusBadge(record.status)}
                            </div>
                            <div className="space-y-2 text-xs text-gray-600">
                              <div className="flex justify-between items-center">
                                <span>Batch/Group:</span>
                                <span className="font-medium text-right">{record.batch}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Sport:</span>
                                <span className="font-medium">{record.sport}</span>
                              </div>
                            </div>
                          </Card>)}
                        {filteredAttendanceData.length > 20 && <div className="text-center text-xs text-gray-500 py-2">
                            Showing 20 of {filteredAttendanceData.length} records. Download PDF for full report.
                          </div>}
                      </> : <>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500">
                            Showing 10 of {mockCoachAttendance.length} coach records
                          </span>
                        </div>
                        {mockCoachAttendance.slice(0, 10).map(record => <Card key={record.id} className="p-3 border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{record.coachName}</h3>
                                <p className="text-xs text-gray-600">{record.date}</p>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs">{record.sport}</Badge>
                            </div>
                            <div className="space-y-3 text-xs text-gray-600">
                              <div className="flex justify-between items-center">
                                <span>Batch:</span>
                                <span className="font-medium text-right">{record.batch}</span>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-gray-50 p-2 rounded">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3 text-green-600" />
                                      <span className="font-medium text-green-600">Entry</span>
                                    </div>
                                    <span className="font-medium">{record.entryTime}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-gray-500">
                                    <MapPin className="h-3 w-3" />
                                    <span>{record.entryLocation}</span>
                                  </div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3 text-red-600" />
                                      <span className="font-medium text-red-600">Exit</span>
                                    </div>
                                    <span className="font-medium">{record.exitTime}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-gray-500">
                                    <MapPin className="h-3 w-3" />
                                    <span>{record.exitLocation}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>)}
                      </>}
                  </>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default AdminDashboard;