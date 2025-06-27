import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Globe, Settings, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Enhanced Backend Connectivity Test Interface
 * Tests connection between frontend and backend with environment variable support
 */
const BackendConnectivityTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentInfo, setDeploymentInfo] = useState<any>({});
  const [customApiUrl, setCustomApiUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  // Get API URL from environment or fallback
  const defaultApiUrl = import.meta.env.VITE_API_URL || 'https://nssbackend-czak.onrender.com/api';
  const currentApiUrl = useCustomUrl && customApiUrl ? customApiUrl : defaultApiUrl;

  useEffect(() => {
    // Get deployment and environment info
    setDeploymentInfo({
      url: window.location.origin,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      envApiUrl: import.meta.env.VITE_API_URL,
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV
    });
    setCustomApiUrl(defaultApiUrl);
  }, [defaultApiUrl]);

  const runConnectivityTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Environment Configuration',
        type: 'info',
        check: () => ({
          status: 'info',
          message: 'Environment variables and configuration',
          data: {
            'VITE_API_URL': import.meta.env.VITE_API_URL || 'Not set',
            'Current API URL': currentApiUrl,
            'Frontend Origin': window.location.origin,
            'Mode': import.meta.env.MODE,
            'Development': import.meta.env.DEV
          }
        })
      },
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
        name: 'Admin Authentication Test',
        endpoint: '/auth/admin/login',
        method: 'POST',
        body: { username: 'admin', password: 'admin123' }
      },
      {
        name: 'Students Endpoint (Public)',
        endpoint: '/students',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      try {
        if (test.type === 'info') {
          const result = test.check!();
          setTestResults(prev => [...prev, {
            name: test.name,
            status: result.status,
            message: result.message,
            responseTime: 'N/A',
            data: JSON.stringify(result.data, null, 2)
          }]);
          continue;
        }

        const startTime = Date.now();
        
        const response = await fetch(`${currentApiUrl}${test.endpoint}`, {
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
          data: error instanceof Error ? error.stack : null
        }]);
      }
    }
    
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'info': return <Settings className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge variant="default">PASS</Badge>;
      case 'error': return <Badge variant="destructive">FAIL</Badge>;
      case 'info': return <Badge variant="secondary">INFO</Badge>;
      default: return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Backend Connectivity Test Interface
          </CardTitle>
          <CardDescription>
            Test the connection between your frontend and backend with environment variable support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Environment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <strong>Frontend URL:</strong>
              <p className="text-sm text-gray-600">{deploymentInfo.url}</p>
            </div>
            <div>
              <strong>Backend API URL:</strong>
              <p className="text-sm text-gray-600">{currentApiUrl}</p>
            </div>
            <div>
              <strong>Environment:</strong>
              <p className="text-sm text-gray-600">
                {deploymentInfo.mode} {deploymentInfo.dev ? '(Development)' : '(Production)'}
              </p>
            </div>
            <div>
              <strong>VITE_API_URL:</strong>
              <p className="text-sm text-gray-600">
                {deploymentInfo.envApiUrl || 'Not set (using fallback)'}
              </p>
            </div>
          </div>

          {/* Custom API URL Input */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useCustomUrl"
                checked={useCustomUrl}
                onChange={(e) => setUseCustomUrl(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="useCustomUrl">Use custom API URL for testing</Label>
            </div>
            
            {useCustomUrl && (
              <div className="space-y-2">
                <Label htmlFor="customApiUrl">Custom API URL:</Label>
                <Input
                  id="customApiUrl"
                  type="url"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  placeholder="https://your-backend.onrender.com/api"
                />
                <p className="text-sm text-gray-500">
                  Enter a different backend URL to test connectivity
                </p>
              </div>
            )}
          </div>
          
          <Button 
            onClick={runConnectivityTests} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Connectivity Tests'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Results</h3>
          {testResults.map((result, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    {result.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(result.status)}
                    {result.responseTime !== 'N/A' && (
                      <Badge variant="outline">{result.responseTime}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{result.message}</p>
                {result.data && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2">
                      View Details
                    </summary>
                    <pre className="p-3 bg-gray-100 rounded overflow-x-auto text-xs">
                      {result.data}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {testResults.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">
                  {testResults.filter(r => r.status === 'info').length}
                </div>
                <div className="text-sm text-gray-600">Info</div>
              </div>
            </div>
            
            {/* Success Message */}
            {testResults.filter(r => r.status === 'success').length >= 3 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ Backend connectivity is working! Your frontend can successfully communicate with the backend.
                </p>
              </div>
            )}

            {/* Error Message */}
            {testResults.filter(r => r.status === 'error').length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  ❌ Some tests failed. Check the error details above and verify your backend URL and CORS configuration.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Environment Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">For Vercel Deployment:</h4>
            <p className="text-sm text-gray-600 mb-2">
              Add this environment variable in your Vercel project settings:
            </p>
            <pre className="p-3 bg-gray-100 rounded text-sm">
VITE_API_URL=https://nssbackend-czak.onrender.com/api
            </pre>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">For Local Development:</h4>
            <p className="text-sm text-gray-600 mb-2">
              Create a <code>.env</code> file in your project root:
            </p>
            <pre className="p-3 bg-gray-100 rounded text-sm">
# .env
VITE_API_URL=https://nssbackend-czak.onrender.com/api
            </pre>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> This component will automatically detect and use the VITE_API_URL environment variable. 
              If not set, it falls back to the hardcoded URL.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackendConnectivityTest;
