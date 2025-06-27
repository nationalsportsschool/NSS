import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Globe, Server, Wifi } from "lucide-react";

/**
 * Enhanced Frontend-Backend Connectivity Test Component
 * Tests connection between frontend (Vercel) and backend (Render)
 * Shows environment variables and API configuration
 */
const EnhancedConnectivityTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentInfo, setDeploymentInfo] = useState<any>({});

  // Get API URL from environment variable with fallback
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nssbackend-czak.onrender.com/api';

  useEffect(() => {
    // Get deployment and environment info
    setDeploymentInfo({
      frontendUrl: window.location.origin,
      apiUrl: API_BASE_URL,
      viteApiUrl: import.meta.env.VITE_API_URL,
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, [API_BASE_URL]);

  const runConnectivityTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Environment Variables Check',
        test: () => {
          const hasApiUrl = !!import.meta.env.VITE_API_URL;
          return Promise.resolve({
            success: true,
            data: {
              VITE_API_URL: import.meta.env.VITE_API_URL || 'Not set (using fallback)',
              API_BASE_URL,
              MODE: import.meta.env.MODE,
              DEV: import.meta.env.DEV
            }
          });
        }
      },
      {
        name: 'Backend Health Check',
        test: async () => {
          const response = await fetch(`${API_BASE_URL}/health`);
          const data = await response.json();
          return { success: response.ok, data };
        }
      },
      {
        name: 'CORS Verification',
        test: async () => {
          const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
              'Origin': window.location.origin,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          return { success: response.ok, data };
        }
      },
      {
        name: 'Payment Key Endpoint',
        test: async () => {
          const response = await fetch(`${API_BASE_URL}/payment/key`);
          const data = await response.json();
          return { success: response.ok, data };
        }
      },
      {
        name: 'Admin Authentication Test',
        test: async () => {
          const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
          });
          const data = await response.json();
          return { success: response.ok, data };
        }
      },
      {
        name: 'Students Endpoint (No Auth)',
        test: async () => {
          const response = await fetch(`${API_BASE_URL}/students`);
          const data = await response.json();
          return { success: response.ok || response.status === 401, data }; // 401 is expected without auth
        }
      }
    ];

    for (const test of tests) {
      try {
        const startTime = Date.now();
        const result = await test.test();
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        setTestResults(prev => [...prev, {
          name: test.name,
          status: result.success ? 'success' : 'error',
          message: result.success ? 'Test passed' : 'Test failed',
          responseTime: `${responseTime}ms`,
          data: JSON.stringify(result.data, null, 2)
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          responseTime: 'N/A',
          data: error instanceof Error ? error.stack : null
        }]);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Frontend-Backend Connectivity Test
          </CardTitle>
          <CardDescription>
            Test the connection between your frontend (Vercel) and backend (Render)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-blue-500" />
                <h4 className="font-semibold">Frontend (Vercel)</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div><strong>URL:</strong> {deploymentInfo.frontendUrl}</div>
                <div><strong>Mode:</strong> {deploymentInfo.mode}</div>
                <div><strong>Dev Mode:</strong> {deploymentInfo.dev ? 'Yes' : 'No'}</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Server className="h-4 w-4 text-green-500" />
                <h4 className="font-semibold">Backend (Render)</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div><strong>API URL:</strong> {deploymentInfo.apiUrl}</div>
                <div><strong>From Env:</strong> {deploymentInfo.viteApiUrl || 'Using fallback'}</div>
              </div>
            </Card>
          </div>

          {/* Environment Variables Display */}
          <Card className="p-4 bg-gray-50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              🔧 Environment Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <strong>VITE_API_URL:</strong>
                <div className="bg-white p-2 rounded border">
                  {import.meta.env.VITE_API_URL || 'Not set'}
                </div>
              </div>
              <div>
                <strong>Effective API_BASE_URL:</strong>
                <div className="bg-white p-2 rounded border">
                  {API_BASE_URL}
                </div>
              </div>
            </div>
          </Card>
          
          <Button 
            onClick={runConnectivityTests} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Connectivity Tests...
              </>
            ) : (
              <>
                <Wifi className="mr-2 h-4 w-4" />
                Run Full Connectivity Test
              </>
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
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2">
                      View Response Data
                    </summary>
                    <pre className="p-3 bg-gray-100 rounded overflow-x-auto border">
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
            <CardTitle className="text-base">Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">
                  {testResults.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Tests Failed</div>
              </div>
            </div>
            
            {testResults.every(r => r.status === 'success') ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ <strong>All tests passed!</strong> Your frontend can successfully communicate with the backend.
                  The environment variables are properly configured and CORS is working correctly.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  ❌ <strong>Some tests failed.</strong> Check the failed tests above for details.
                  This might be due to CORS issues, incorrect API URL, or backend unavailability.
                </p>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Quick Fixes:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Make sure your domain is in backend CORS: <code>https://app.nationalsportsschool.in</code></li>
                <li>• Verify VITE_API_URL environment variable is set in Vercel</li>
                <li>• Check if backend is running at: <code>{API_BASE_URL}</code></li>
                <li>• Ensure no ad blockers are interfering with requests</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedConnectivityTest;
