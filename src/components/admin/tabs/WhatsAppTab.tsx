
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock4 } from 'lucide-react';

type WhatsAppLog = {
  id: number;
  studentName: string;
  message: string;
  status: 'delivered' | 'pending';
  date: string;
};

interface WhatsAppTabProps {
  whatsAppLogs: WhatsAppLog[];
}

const WhatsAppTab: React.FC<WhatsAppTabProps> = ({ whatsAppLogs }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {whatsAppLogs.map((log) => (
        <Card key={log.id} className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{log.studentName}</CardTitle>
              <Badge variant={log.status === 'delivered' ? 'default' : 'outline'} className="flex items-center gap-1">
                {log.status === 'delivered' ? <CheckCircle className="h-3 w-3" /> : <Clock4 className="h-3 w-3" />}
                {log.status === 'delivered' ? 'Delivered' : 'Pending'}
              </Badge>
            </div>
            <CardDescription>{log.date}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>{log.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WhatsAppTab;
