
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ParentCredentialsCardProps {
  credentials: { username: string; password: string };
  onBack: () => void;
}

const ParentCredentialsCard = ({ credentials, onBack }: ParentCredentialsCardProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Parent Login Details</h1>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-green-700">Registration Successful!</CardTitle>
            <CardDescription>Parent login credentials have been generated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 mb-4">
                Please share these credentials with the parent for accessing their dashboard:
              </p>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Username</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-2 bg-white rounded border text-sm font-mono">
                      {credentials.username}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(credentials.username, 'Username')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-2 bg-white rounded border text-sm font-mono">
                      {showPassword ? credentials.password : '••••••••'}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(credentials.password, 'Password')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Important:</p>
              <ul className="space-y-1">
                <li>• Save these credentials securely</li>
                <li>• Share them only with the parent</li>
                <li>• Parent can change password after first login</li>
              </ul>
            </div>

            <Button onClick={onBack} className="w-full bg-red-600 hover:bg-red-700">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentCredentialsCard;
