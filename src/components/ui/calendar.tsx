
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  allowFuture?: boolean;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  allowFuture = false,
  disabled,
  toDate,
  ...props
}: CalendarProps) {
  // Combine user-provided disabled function with future date restriction
  const isDateDisabled = React.useCallback((date: Date) => {
    // If allowFuture is false, disable future dates
    if (!allowFuture && date > new Date()) {
      return true;
    }
    // Apply user-provided disabled function if it's a function
    if (typeof disabled === 'function') {
      return disabled(date);
    }
    return false;
  }, [disabled, allowFuture]);

  // Set toDate to today if allowFuture is false and no toDate is provided
  const effectiveToDate = !allowFuture && !toDate ? new Date() : toDate;
  
  // Use the appropriate disabled prop
  const effectiveDisabled = typeof disabled === 'function' || !allowFuture ? isDateDisabled : disabled;
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disabled={effectiveDisabled}
      toDate={effectiveToDate}
      className={cn("p-2 sm:p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 min-w-0",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium truncate",
        caption_dropdowns: "flex justify-center gap-1 flex-wrap",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex-shrink-0"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 min-w-0",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 sm:w-9 font-normal text-[0.7rem] sm:text-[0.8rem] flex-shrink-0",
        row: "flex w-full mt-2",
        cell: "h-8 w-8 sm:h-9 sm:w-9 text-center text-sm p-0 relative flex-shrink-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal aria-selected:opacity-100 text-xs sm:text-sm"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        dropdown_month: "relative inline-flex h-7 sm:h-8 items-center justify-center rounded-md border border-input bg-background px-2 sm:px-3 py-1 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-0 max-w-[120px]",
        dropdown_year: "relative inline-flex h-7 sm:h-8 items-center justify-center rounded-md border border-input bg-background px-2 sm:px-3 py-1 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-0 max-w-[80px]",
        dropdown: "absolute z-50 min-w-[8rem] max-w-[90vw] max-h-48 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
