
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: (date: Date) => boolean
  className?: string
  allowFuture?: boolean
}

export function DatePicker({ 
  value, 
  onChange, 
  placeholder = "Pick a date", 
  disabled,
  className,
  allowFuture = false
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (date: Date | undefined) => {
    onChange(date)
    setOpen(false)
  }

  // Combine user-provided disabled function with future date restriction
  const isDateDisabled = React.useCallback((date: Date) => {
    // If allowFuture is false, disable future dates
    if (!allowFuture && date > new Date()) {
      return true;
    }
    // Apply user-provided disabled function
    return disabled ? disabled(date) : false;
  }, [disabled, allowFuture]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal h-11 min-w-0",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center min-w-0 flex-1">
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {value ? format(value, "PPP") : <span>{placeholder}</span>}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-w-[90vw]" align="start" side="bottom">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={isDateDisabled}
          captionLayout="dropdown"
          className="pointer-events-auto w-fit"
          toDate={allowFuture ? undefined : new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}
