import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator 
} from '@/components/ui/command';
import { 
  BarChart2, 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  Settings, 
  User, 
  LogOut, 
  Search
} from 'lucide-react';

interface CommandMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userType: 'admin' | 'coach' | 'parent';
  navigationItems: Array<{
    label: string;
    icon: React.ReactNode;
    path: string;
  }>;
}

const CommandMenu = ({ isOpen, setIsOpen, userType, navigationItems }: CommandMenuProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  // Get icon component by name
  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'analytics':
        return <BarChart2 className="h-4 w-4 mr-2" />;
      case 'dashboard':
        return <Home className="h-4 w-4 mr-2" />;
      case 'students':
        return <Users className="h-4 w-4 mr-2" />;
      case 'schedule':
        return <Calendar className="h-4 w-4 mr-2" />;
      case 'payments':
        return <CreditCard className="h-4 w-4 mr-2" />;
      case 'settings':
        return <Settings className="h-4 w-4 mr-2" />;
      case 'profile':
        return <User className="h-4 w-4 mr-2" />;
      default:
        return <Search className="h-4 w-4 mr-2" />;
    }
  };

  // Quick actions based on user type
  const getQuickActions = () => {
    const commonActions = [
      { name: 'Profile Settings', action: () => navigate(`/${userType}/profile`) },
      { name: 'Log Out', action: () => navigate('/') },
    ];
    
    if (userType === 'admin') {
      return [
        { name: 'Add New Student', action: () => navigate('/admin/dashboard') },
        { name: 'View Payment Reports', action: () => navigate('/admin/payments') },
        ...commonActions
      ];
    } else if (userType === 'coach') {
      return [
        { name: 'Mark Attendance', action: () => navigate('/coach/dashboard') },
        { name: 'Add Activity Report', action: () => navigate('/coach/dashboard') },
        ...commonActions
      ];
    } else {
      return [
        { name: 'Make Payment', action: () => navigate('/parent/payments') },
        { name: 'View Attendance', action: () => navigate('/parent/dashboard') },
        ...commonActions
      ];
    }
  };
  
  const quickActions = getQuickActions();

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder={`Search ${userType} portal...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.path}
              onSelect={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
            >
              {getIcon(item.label)}
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Quick Actions">
          {quickActions.map((action, index) => (
            <CommandItem
              key={index}
              onSelect={() => {
                action.action();
                setIsOpen(false);
              }}
            >
              {action.name.toLowerCase().includes('log out') ? (
                <LogOut className="h-4 w-4 mr-2 text-red-600" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              <span>{action.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandMenu;
