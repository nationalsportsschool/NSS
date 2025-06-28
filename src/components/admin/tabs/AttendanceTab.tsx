
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Download, Activity, MapPin, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDrills } from '@/lib/api';
import DrillActivityCard from '@/components/DrillActivityCard';

type AttendanceRecord = {
  id: number;
  name: string; // Transformed field from student.name or coach.name
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  batch?: string; // Only for students
  sport: string; // Transformed field from student.sport or coach.sport
  total_hours?: number; // Only for coaches
  notes?: string;
  entry_location?: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: number;
  };
  exit_location?: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: number;
  };
};

interface AttendanceTabProps {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  generateAttendanceReport: () => void;
  studentAttendance: AttendanceRecord[];
  coachAttendance: AttendanceRecord[];
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({
  dateRange,
  setDateRange,
  generateAttendanceReport,
  studentAttendance,
  coachAttendance,
}) => {
  const [isDrillHistoryOpen, setIsDrillHistoryOpen] = useState(false);
  const { data: drillsData, isLoading: drillsLoading } = useDrills();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Management</CardTitle>
        <CardDescription>Select date range to view attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-stretch sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[260px] md:w-[300px] justify-start text-left font-normal min-w-0",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 max-w-[90vw]" align="start" side="bottom">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2}
                className="w-fit"
                allowFuture={false}
              />
            </PopoverContent>
          </Popover>
          <Dialog open={isDrillHistoryOpen} onOpenChange={setIsDrillHistoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Activity className="mr-2 h-4 w-4" /> Drill History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Drill History</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {drillsLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : drillsData && (drillsData as any)?.data && Array.isArray((drillsData as any).data) && (drillsData as any).data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(drillsData as any).data.map((drill: any) => (
                      <DrillActivityCard
                        key={drill.id}
                        activity={{
                          id: drill.id,
                          title: drill.title,
                          description: drill.description || 'No description provided',
                          image: drill.image_url || '/placeholder.svg',
                          date: drill.date,
                          sport: drill.sport,
                          participants: drill.participants || 0,
                          duration: drill.duration || 'N/A',
                          instructor: drill.instructor?.name || 'Unknown'
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No drill activities found. Create some drills from the Coach Dashboard.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            onClick={generateAttendanceReport}
          >
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
          </TabsList>
          <TabsContent value="students" className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Showing {studentAttendance.length} of {studentAttendance.length} records</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {studentAttendance.map((record) => (
                <Card key={record.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{record.name}</CardTitle>
                      <Badge
                        className={cn({
                          'bg-green-100 text-green-800 border-green-300': record.status === 'Present',
                          'bg-yellow-100 text-yellow-800 border-yellow-300': record.status === 'Late',
                          'bg-red-100 text-red-800 border-red-300': record.status === 'Absent',
                          'bg-gray-100 text-gray-800 border-gray-300': record.status === 'Excused',
                        })}
                        variant="outline"
                      >
                        {record.status}
                      </Badge>
                    </div>
                    <CardDescription>{new Date(record.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {record.batch && <p>Batch: <span className="font-medium text-primary">{record.batch}</span></p>}
                    <p>Sport: <span className="font-medium text-primary">{record.sport}</span></p>
                    {record.notes && <p className="text-xs mt-1 italic">{record.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="coaches" className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Showing {coachAttendance.length} of {coachAttendance.length} records</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {coachAttendance.map((record) => (
                <Card key={record.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{record.name}</CardTitle>
                      <Badge
                        className={cn({
                          'bg-green-100 text-green-800 border-green-300': record.status === 'Present',
                          'bg-yellow-100 text-yellow-800 border-yellow-300': record.status === 'Late',
                          'bg-red-100 text-red-800 border-red-300': record.status === 'Absent',
                          'bg-gray-100 text-gray-800 border-gray-300': record.status === 'Excused',
                        })}
                        variant="outline"
                      >
                        {record.status}
                      </Badge>
                    </div>
                    <CardDescription>{new Date(record.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>Sport: <span className="font-medium text-primary">{record.sport}</span></p>
                    {record.total_hours !== undefined && (
                      <p>Hours: <span className="font-medium text-primary">{record.total_hours}</span></p>
                    )}
                    {record.notes && <p className="text-xs italic">{record.notes}</p>}
                    {record.entry_location && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Entry Location</span>
                        </div>
                        <p className="text-xs pl-4">{record.entry_location.address}</p>
                        <div className="flex items-center gap-1 pl-4">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">
                            {new Date(record.entry_location.timestamp).toLocaleString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                    {record.exit_location && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-red-600" />
                          <span className="text-xs font-medium text-red-700">Exit Location</span>
                        </div>
                        <p className="text-xs pl-4">{record.exit_location.address}</p>
                        <div className="flex items-center gap-1 pl-4">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">
                            {new Date(record.exit_location.timestamp).toLocaleString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                    {!record.entry_location && !record.exit_location && record.status !== 'Present' && (
                      <p className="text-xs text-muted-foreground italic">No location data available</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttendanceTab;
