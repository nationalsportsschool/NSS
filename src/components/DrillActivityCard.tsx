import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock } from 'lucide-react';

export interface DrillActivity {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  sport: string;
  participants: number;
  duration: string;
  instructor: string;
}

interface DrillActivityCardProps {
  activity: DrillActivity;
}

const DrillActivityCard: React.FC<DrillActivityCardProps> = ({ activity }) => {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={`https://images.unsplash.com/${activity.image}?w=400&h=225&fit=crop`}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-gray-800 hover:bg-white text-xs">
            {activity.sport}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
            {activity.title}
          </h3>
          
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
          
          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{activity.date}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{activity.participants} participants</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{activity.duration}</span>
              </div>
            </div>
            
            <div className="pt-1 border-t border-gray-100">
              <span className="font-medium">Instructor: {activity.instructor}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrillActivityCard;
