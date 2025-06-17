
import React from 'react';
import LoginCard from '@/components/LoginCard';
import { Users } from 'lucide-react';

const ParentLogin = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <LoginCard
        userType="parent"
        title="Parent"
        description="Track your child's progress and school communications"
        icon={<Users className="h-12 w-12 text-green-500" />}
      />
    </div>
  );
};

export default ParentLogin;
