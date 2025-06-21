import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommandMenu from '@/components/CommandMenu';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  userType: 'admin' | 'coach' | 'parent';
  currentPath: string;
}

const DashboardLayout = ({ 
  children, 
  title, 
  userType,
  currentPath
}: DashboardLayoutProps) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const navigate = useNavigate();  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Main Content */}<main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Title */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h1>
          </div>
          
          {/* Page Content */}
          <div className="mt-6">
            {children}
          </div>
        </div>
      </main>      {/* Command Menu component */}
      {isCommandOpen && (
        <CommandMenu
          isOpen={isCommandOpen}
          setIsOpen={setIsCommandOpen}
          userType={userType}
          navigationItems={[]}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
