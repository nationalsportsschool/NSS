
import React from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Download, Activity, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type AttendanceRecord = {
  id: number;
  name: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  batch: string;
  sport: string;
  entryLocation?: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  };
  exitLocation?: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
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
          <Button variant="outline" className="w-full sm:w-auto">
            <Activity className="mr-2 h-4 w-4" /> Drill History
          </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[450px] overflow-auto p-1">
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
                    <p>Batch: <span className="font-medium text-primary">{record.batch}</span></p>
                    <p>Sport: <span className="font-medium text-primary">{record.sport}</span></p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="coaches" className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Showing {coachAttendance.length} of {coachAttendance.length} records</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[450px] overflow-auto p-1">
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
                    {record.entryLocation && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Entry Location</span>
                        </div>
                        <p className="text-xs pl-4">{record.entryLocation.address}</p>
                        <div className="flex items-center gap-1 pl-4">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">
                            {new Date(record.entryLocation.timestamp).toLocaleString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                    {record.exitLocation && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-red-600" />
                          <span className="text-xs font-medium text-red-700">Exit Location</span>
                        </div>
                        <p className="text-xs pl-4">{record.exitLocation.address}</p>
                        <div className="flex items-center gap-1 pl-4">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">
                            {new Date(record.exitLocation.timestamp).toLocaleString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                    {!record.entryLocation && !record.exitLocation && record.status !== 'Present' && (
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
