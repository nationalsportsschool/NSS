
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

const CoachAttendanceCard = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [entryLocation, setEntryLocation] = useState<LocationData | null>(null);
  const { toast } = useToast();

  const handleCheckIn = () => {
    const timestamp = new Date();
    
    console.log('=== COACH CHECK-IN ===');
    console.log('Check-in initiated at:', timestamp.toISOString());
    console.log('Formatted time:', timestamp.toLocaleString());
    
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
          };
          
          setEntryLocation(location);
          
          console.log('Geolocation successful:');
          console.log('- Latitude:', location.latitude);
          console.log('- Longitude:', location.longitude);
          console.log('- Accuracy:', location.accuracy, 'meters');
          console.log('- GPS timestamp:', new Date(location.timestamp).toISOString());
          console.log('Complete check-in data:', {
            checkInTime: timestamp.toISOString(),
            entryLocation: location,
            formattedTime: timestamp.toLocaleString(),
            coachStatus: 'checked-in'
          });
        },
        (error) => {
          console.log('Geolocation failed:');
          console.log('- Error code:', error.code);
          console.log('- Error message:', error.message);
          console.log('Check-in completed without location data');
          console.log('Check-in data (no location):', {
            checkInTime: timestamp.toISOString(),
            entryLocation: null,
            formattedTime: timestamp.toLocaleString(),
            coachStatus: 'checked-in',
            locationError: error.message
          });
        }
      );
    } else {
      console.log('Geolocation not supported by browser');
      console.log('Check-in data (no geolocation support):', {
        checkInTime: timestamp.toISOString(),
        entryLocation: null,
        formattedTime: timestamp.toLocaleString(),
        coachStatus: 'checked-in',
        locationError: 'Geolocation not supported'
      });
    }

    setIsCheckedIn(true);
    setCheckInTime(timestamp);
    console.log('Coach state updated: isCheckedIn = true');
    console.log('======================');
    
    toast({
      title: "Checked In",
      description: "Session started with location tracking",
    });
  };

  const handleCheckOut = () => {
    const checkOutTime = new Date();
    const duration = checkInTime ? 
      Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60)) : 0;
    
    // Get exit location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const exitLocation: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
          };
          
          const sessionData = {
            checkInTime: checkInTime?.toISOString() || null,
            checkOutTime: checkOutTime.toISOString(),
            durationMinutes: duration,
            sessionDate: checkOutTime.toDateString(),
            coachStatus: 'checked-out',
            entryLocation: entryLocation,
            exitLocation: exitLocation
          };

          console.log('=== COACH CHECK-OUT ===');
          console.log('Check-out initiated at:', checkOutTime.toISOString());
          console.log('Check-in time was:', checkInTime?.toISOString() || 'Not recorded');
          console.log('Session duration:', duration, 'minutes');
          console.log('Entry location:', entryLocation);
          console.log('Exit location:', exitLocation);
          console.log('Complete session data:', sessionData);
          console.log('Coach state updated: isCheckedIn = false');
          console.log('=======================');
        },
        (error) => {
          console.log('Exit location failed:', error.message);
          const sessionData = {
            checkInTime: checkInTime?.toISOString() || null,
            checkOutTime: checkOutTime.toISOString(),
            durationMinutes: duration,
            sessionDate: checkOutTime.toDateString(),
            coachStatus: 'checked-out',
            entryLocation: entryLocation,
            exitLocation: null,
            exitLocationError: error.message
          };
          console.log('Session data (no exit location):', sessionData);
        }
      );
    } else {
      const sessionData = {
        checkInTime: checkInTime?.toISOString() || null,
        checkOutTime: checkOutTime.toISOString(),
        durationMinutes: duration,
        sessionDate: checkOutTime.toDateString(),
        coachStatus: 'checked-out',
        entryLocation: entryLocation,
        exitLocation: null,
        exitLocationError: 'Geolocation not supported'
      };
      console.log('Session data (no geolocation support):', sessionData);
    }
    
    setIsCheckedIn(false);
    setCheckInTime(null);
    setEntryLocation(null);
    
    toast({
      title: "Checked Out",
      description: `Session duration: ${duration} minutes with location tracking`,
    });
  };

  return (
    <div className="w-full">
      {isCheckedIn ? (
        <Button
          onClick={handleCheckOut}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium"
        >
          Check Out
        </Button>
      ) : (
        <Button
          onClick={handleCheckIn}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium"
        >
          Check In
        </Button>
      )}
    </div>
  );
};

export default CoachAttendanceCard;
