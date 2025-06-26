import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCoachAuth } from '@/contexts/CoachAuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedCoachRouteProps {
  children: React.ReactNode;
}

const ProtectedCoachRoute: React.FC<ProtectedCoachRouteProps> = ({ children }) => {
  const { isLoggedIn, isLoading } = useCoachAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
            <div className="text-center text-sm text-gray-500">
              Verifying authentication...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedCoachRoute;
