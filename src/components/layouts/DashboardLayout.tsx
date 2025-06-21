import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  userType: 'admin' | 'coach' | 'parent';
  currentPath: string;
}

const DashboardLayout = ({ 
  children, 
  title, 
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">
        <div className="flex h-16 items-center justify-center px-6">
          <div className="flex items-center gap-3" onClick={() => navigate('/')} role="button">
            <img 
              src="/lovable-uploads/33900580-8f8e-4c8d-b6d6-511af21db8ca.png" 
              alt="National Sports School Logo" 
              className="h-9 w-auto object-contain"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            {title}
          </h1>
          
          {/* Page Content */}
          <div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
