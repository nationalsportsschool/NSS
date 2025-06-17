
import React from 'react';
import { User, Trophy, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CoachInfo {
  id: string;
  name: string;
  sports: string[];
  experience: string;
  phone: string;
  email: string;
  schedule: string;
}

interface CoachInfoCardProps {
  coachInfo: CoachInfo;
  childName: string;
}

const CoachInfoCard = ({ coachInfo, childName }: CoachInfoCardProps) => {
  const handleContactCoach = (method: 'phone' | 'email') => {
    console.log('=== COACH CONTACT ===');
    console.log('Child:', childName);
    console.log('Coach:', coachInfo.name);
    console.log('Contact Method:', method);
    console.log('Contact Info:', method === 'phone' ? coachInfo.phone : coachInfo.email);
    console.log('Timestamp:', new Date().toISOString());
    console.log('====================');

    if (method === 'phone') {
      window.open(`tel:${coachInfo.phone}`, '_self');
    } else {
      window.open(`mailto:${coachInfo.email}?subject=Regarding ${childName}`, '_self');
    }
  };

  return (
    <div className="bg-card shadow-sm border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-bold text-foreground">Current Coach</h3>
            <p className="text-sm text-muted-foreground">Training {childName}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold text-foreground">{coachInfo.name}</h4>
            <p className="text-muted-foreground">{coachInfo.experience} of experience</p>
          </div>
          <Trophy className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h5 className="font-semibold text-foreground mb-2">Sports Specialization</h5>
          <div className="flex flex-wrap gap-2">
            {coachInfo.sports.map((sport, index) => (
              <Badge key={index} className="bg-primary/10 text-primary border-primary/20">
                {sport}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-foreground mb-2">Schedule</h5>
          <p className="text-muted-foreground">{coachInfo.schedule}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => handleContactCoach('phone')}
            variant="outline" 
            className="flex-1"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button 
            onClick={() => handleContactCoach('email')}
            variant="outline" 
            className="flex-1"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachInfoCard;
