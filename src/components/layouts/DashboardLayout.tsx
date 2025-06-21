import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import CommandMenu from '@/components/CommandMenu';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BarChart3, 
  Users, 
  Calendar, 
  Settings, 
  CreditCard, 
  LogOut
} from 'lucide-react';

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
  
  // Define navigation items based on user type
  const getNavigationItems = () => {
    if (userType === 'admin') {
      return [
        { label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, path: '/admin/analytics' },
        { label: 'Dashboard', icon: <Home className="h-4 w-4" />, path: '/admin/dashboard' },
      ];
    } else if (userType === 'coach') {
      return [
        { label: 'Dashboard', icon: <Home className="h-4 w-4" />, path: '/coach/dashboard' },
        { label: 'Students', icon: <Users className="h-4 w-4" />, path: '/coach/students' },
        { label: 'Schedule', icon: <Calendar className="h-4 w-4" />, path: '/coach/schedule' },
        { label: 'Settings', icon: <Settings className="h-4 w-4" />, path: '/coach/settings' }
      ];
    }
    
    return [
      { label: 'Dashboard', icon: <Home className="h-4 w-4" />, path: '/parent/dashboard' },
      { label: 'Schedule', icon: <Calendar className="h-4 w-4" />, path: '/parent/schedule' },
      { label: 'Payments', icon: <CreditCard className="h-4 w-4" />, path: '/parent/payments' },
      { label: 'Settings', icon: <Settings className="h-4 w-4" />, path: '/parent/settings' }
    ];
  };
  
  const navigationItems = getNavigationItems();
  
  // Get current page for breadcrumb
  const currentPageName = navigationItems.find(item => item.path === currentPath)?.label || title;
  
  // Colors based on user type
  const getUserTypeColors = () => {
    switch (userType) {
      case 'admin':
        return {
          primary: 'bg-red-600 hover:bg-red-700 text-white',
          subtle: 'text-red-600',
          separator: 'text-red-300'
        };
      case 'coach':
        return {
          primary: 'bg-blue-600 hover:bg-blue-700 text-white', 
          subtle: 'text-blue-600',
          separator: 'text-blue-300'
        };
      case 'parent':
        return {
          primary: 'bg-green-600 hover:bg-green-700 text-white',
          subtle: 'text-green-600',
          separator: 'text-green-300'
        };
    }
  };
  
  const colors = getUserTypeColors();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            {/* Brand Logo (Always visible) */}
            <div className="flex items-center gap-2" onClick={() => navigate('/')} role="button">
              <img 
                src="/lovable-uploads/33900580-8f8e-4c8d-b6d6-511af21db8ca.png" 
                alt="National Sports School Logo" 
                className="h-8 w-auto object-contain"
              />
              <span className="font-bold text-xl hidden sm:block">NSS</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="flex items-center gap-6 mx-6 lg:mx-10">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? "secondary" : "ghost"}
                className={cn(
                  "gap-2 transition-all", 
                  currentPath === item.path ? "" : "hover:bg-gray-100"
                )}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="hidden lg:inline-block">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs and Title */}
          <div>
            <Breadcrumb className="mb-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/${userType}/dashboard`); }}>
                      {userType === 'admin' ? 'Admin' : userType === 'coach' ? 'Coach' : 'Parent'}
                    </a>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={colors.separator} />
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-medium">
                    {currentPageName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>            
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
          navigationItems={navigationItems}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
