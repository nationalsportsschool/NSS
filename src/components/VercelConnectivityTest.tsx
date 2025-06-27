import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Globe } from "lucide-react";

/**
 * Vercel Connectivity Test Component
 * Use this temporarily to test backend connectivity from your Vercel deployment
 * Remove after confirming everything works
 */
const VercelConnectivityTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentInfo, setDeploymentInfo] = useState<any>({});

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nssbackend-czak.onrender.com/api';

  useEffect(() => {
    // Get deployment info
    setDeploymentInfo({
      url: window.location.origin,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, []);

  const runConnectivityTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Backend Health Check',
        endpoint: '/health',
        method: 'GET'
      },
      {
        name: 'CORS Verification',
        endpoint: '/health',
        method: 'GET',
        headers: { 'Origin': window.location.origin }
      },
      {
        name: 'Payment Key Endpoint',
        endpoint: '/payment/key',
        method: 'GET'
      },
      {
        name: 'Admin Authentication',
        endpoint: '/auth/admin/login',
        method: 'POST',
        body: { username: 'admin', password: 'admin123' }
      }
    ];

    for (const test of tests) {
      try {
        const startTime = Date.now();
        
        const response = await fetch(`${API_BASE_URL}${test.endpoint}`, {
          method: test.method,
          headers: {
            'Content-Type': 'application/json',
            ...test.headers
          },
          ...(test.body && { body: JSON.stringify(test.body) })
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        const data = await response.json();
        
        setTestResults(prev => [...prev, {
          name: test.name,
          status: response.ok ? 'success' : 'error',
          message: response.ok ? 'Connection successful' : `HTTP ${response.status}: ${response.statusText}`,
          responseTime: `${responseTime}ms`,
          data: JSON.stringify(data, null, 2)
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          responseTime: 'N/A',
          data: null
        }]);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Vercel-Render Connectivity Test
          </CardTitle>
          <CardDescription>
            Test the connection between your Vercel frontend and Render backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <strong>Frontend (Vercel):</strong>
              <p className="text-sm text-gray-600">{deploymentInfo.url}</p>
            </div>
            <div>
              <strong>Backend (Render):</strong>
              <p className="text-sm text-gray-600">{API_BASE_URL}</p>
            </div>
          </div>
          
          <Button 
            onClick={runConnectivityTests} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Run Connectivity Tests'
            )}
          </Button>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Test Results</h3>
          {testResults.map((result, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    {result.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                      {result.status === 'success' ? 'PASS' : 'FAIL'}
                    </Badge>
                    <Badge variant="outline">{result.responseTime}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{result.message}</p>
                {result.data && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                      View Response Data
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                      {result.data}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {testResults.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Tests Failed</div>
              </div>
            </div>
            
            {testResults.every(r => r.status === 'success') && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ All tests passed! Your Vercel frontend can successfully communicate with the Render backend.
                  You can now remove this test component and deploy the production version.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VercelConnectivityTest;
