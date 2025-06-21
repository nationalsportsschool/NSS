
import { DrillActivity } from '@/components/DrillActivityCard';

// Mock data generation functions
export const generateMockStudents = () => {
  const students = [];  const sports = ['Cricket', 'Football', 'Tennis', 'Athletics', 'Swimming', 'Basketball'];
  const groups = ['Beginners', 'Intermediate', 'Advanced', 'Professional'];
  const paymentStatuses = ['paid', 'not_paid', 'upcoming'];
  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Saanvi', 'Gauri', 'Aadhya', 'Myra', 'Pari', 'Riya', 'Aisha', 'Tara'];
  const lastNames = ['Patel', 'Sharma', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Verma', 'Das', 'Menon', 'Iyer', 'Joshi', 'Khan', 'Mehta', 'Shah', 'Nair', 'Rao', 'Pillai', 'Chopra', 'Bose', 'Malik'];
  for (let i = 0; i < 40; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length)];
    const sport = sports[i % sports.length];
    const group = groups[i % groups.length];
    const paymentStatus = paymentStatuses[i % paymentStatuses.length];
      // Calculate fee plan based on sport (all under ₹3000)
    const getFeePlan = (sport: string) => {
      if (sport === 'Tennis' || sport === 'Swimming') return { plan: '₹2800', amount: 2800 };
      if (sport === 'Football') return { plan: '₹2500', amount: 2500 };
      if (sport === 'Cricket') return { plan: '₹2700', amount: 2700 };
      if (sport === 'Athletics') return { plan: '₹2200', amount: 2200 };
      return { plan: '₹2400', amount: 2400 }; // Basketball
    };
    
    const feeInfo = getFeePlan(sport);    students.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      sport,
      feePlan: feeInfo.plan,
      paymentStatus,
      pendingAmount: 0, // No pending amounts as requested
      parentContact: `+91 98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      lastPayment: new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
      group
    });
  }
  return students;
};

// Generate initial mock data
export const mockStudents = generateMockStudents();

// Create payment logs based on students
export const generateMockPaymentLogs = () => {
  const logs = [];
  const statuses = ['paid', 'not_paid', 'upcoming'];
  const amounts = ['₹5000', '₹8000', '₹12000', '₹4000'];

  for (let i = 0; i < mockStudents.length; i++) {
    logs.push({
      id: i + 1,
      studentName: mockStudents[i]?.name || `Student ${i + 1}`,
      amount: amounts[i % amounts.length],
      status: statuses[i % statuses.length],
      date: new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
      method: 'UPI'
    });
  }
  return logs;
};

// Generate other mock data
export const mockPaymentLogs = generateMockPaymentLogs();

export const generateMockWhatsAppLogs = () => {
  const logs = [];
  const messageTypes = ['Payment reminder sent', 'Session reminder sent', 'Schedule update notification', 'Welcome message sent', 'Attendance notification', 'Monthly report sent'];
  const statuses = ['delivered', 'pending'];

  for (let i = 0; i < mockStudents.length; i++) {
    logs.push({
      id: i + 1,
      studentName: mockStudents[i]?.name || `Student ${i + 1}`,
      message: messageTypes[i % messageTypes.length],
      status: statuses[i % statuses.length],
      date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0]
    });
  }
  return logs;
};

export const mockWhatsAppLogs = generateMockWhatsAppLogs();

export const generateMockAttendance = (type: 'student' | 'coach') => {
  const names = type === 'student' 
    ? ['Aarav Patel', 'Vivaan Sharma', 'Aditya Kumar', 'Vihaan Singh', 'Ananya Gupta', 'Diya Reddy', 'Saanvi Verma', 'Gauri Das', 'Ayaan Khan', 'Krishna Iyer']
    : ['Suresh Kumar', 'Ramesh Sharma', 'Priya Singh', 'Amit Patel'];
  const statuses: ('Present' | 'Absent' | 'Late' | 'Excused')[] = ['Present', 'Absent', 'Late', 'Excused'];
  const records = [];
  for (let i = 0; i < 20; i++) {
    records.push({
      id: i + 1,
      name: names[i % names.length],
      date: new Date(2025, 5, 10 + (i % 2)).toISOString().split('T')[0], // June 10 or 11, 2025
      status: statuses[i % statuses.length],
      batch: type === 'student' ? (i % 2 === 0 ? 'Soccer Training' : 'Basketball Training') : 'Senior Coach',
      sport: type === 'student' ? (i % 2 === 0 ? 'Soccer' : 'Basketball') : 'Management'
    });
  }
  return records;
};

export const mockStudentAttendance = generateMockAttendance('student');
export const mockCoachAttendance = generateMockAttendance('coach');

export const mockDrillForAdmin: DrillActivity = {
  id: 1,
  title: 'Advanced Batting Techniques',
  description: 'A session focusing on improving batting skills against fast bowlers, led by our top coach.',
  image: 'photo-1593341646782-e01c95c78a1a', // A relevant image from Unsplash
  date: '2025-06-20',
  sport: 'Cricket',
  participants: 12,
  duration: '90 mins',
  instructor: 'Coach Suresh',
};
