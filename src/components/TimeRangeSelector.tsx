import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TimeRangeOption } from '@/types';

interface TimeRangeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

// 时间范围选项
const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { label: '最近 5 分钟', value: 5 },
  { label: '最近 15 分钟', value: 15 },
  { label: '最近 1 小时', value: 60 },
  { label: '最近 24 小时', value: 1440 },
];

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">时间范围:</span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="选择时间范围" />
        </SelectTrigger>
        <SelectContent>
          {TIME_RANGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
