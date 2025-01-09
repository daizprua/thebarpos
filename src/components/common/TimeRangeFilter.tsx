import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TimeRange = "day" | "week" | "month";

interface TimeRangeFilterProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

export function TimeRangeFilter({ timeRange, onTimeRangeChange }: TimeRangeFilterProps) {
  return (
    <Select value={timeRange} onValueChange={(value: TimeRange) => onTimeRangeChange(value)}>
      <SelectTrigger className="w-[180px] bg-card text-white">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        <SelectItem value="day" className="text-white hover:bg-muted/50">Today</SelectItem>
        <SelectItem value="week" className="text-white hover:bg-muted/50">This Week</SelectItem>
        <SelectItem value="month" className="text-white hover:bg-muted/50">This Month</SelectItem>
      </SelectContent>
    </Select>
  );
}