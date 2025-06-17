
import React from 'react';
import LoginCard from '@/components/LoginCard';
import { User } from 'lucide-react';

const CoachLogin = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <LoginCard
        userType="coach"
        title="Coach"
        description="Manage teams, training sessions, and athlete progress"
        icon={<User className="h-12 w-12 text-blue-500" />}
      />
    </div>
  );
};

export default CoachLogin;
