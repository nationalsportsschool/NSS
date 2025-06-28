import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EnhancedConnectivityTest from '@/components/EnhancedConnectivityTest';
import BackendConnectivityTest from '@/components/VercelConnectivityTest';

/**
 * Hidden Testing Page
 * Contains all testing interfaces and connectivity tools
 * Accessible only via direct URL: /testing
 */
const Testing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">System Testing Interface</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive testing tools for frontend-backend connectivity and system validation
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main
          </Button>
        </div>

        {/* Warning Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Internal Testing Interface
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This page is for development and testing purposes only. It contains tools to verify
                  system connectivity, environment variables, and API endpoints.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Connectivity Test */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Enhanced Connectivity Test</h2>
            <p className="text-gray-600 mb-6">
              Comprehensive frontend-backend connectivity testing with environment variable validation
            </p>
            <EnhancedConnectivityTest />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Backend Connectivity Test */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Backend Connectivity Test</h2>
            <p className="text-gray-600 mb-6">
              Advanced backend testing interface with custom URL support and detailed diagnostics
            </p>
            <BackendConnectivityTest />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-8 border-t border-gray-200">
          <p>NSS Testing Interface - For Development Use Only</p>
          <p className="mt-1">
            Access this page directly via: <code className="bg-gray-100 px-2 py-1 rounded">/testing</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Testing;
