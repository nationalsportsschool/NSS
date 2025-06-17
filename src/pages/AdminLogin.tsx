
import React from 'react';
import LoginCard from '@/components/LoginCard';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <LoginCard
        userType="admin"
        title="Administrator"
        description=""
        icon={<Shield className="h-12 w-12 text-red-500" />}
      />
    </div>
  );
};

export default AdminLogin;
