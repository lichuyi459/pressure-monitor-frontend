import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TimeRangeOption } from '@/types';
import { Clock } from 'lucide-react';

interface TimeRangeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { label: '最近 5 分钟', value: 5 },
  { label: '最近 15 分钟', value: 15 },
  { label: '最近 1 小时', value: 60 },
  { label: '最近 24 小时', value: 1440 },
];

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-gray-400" />
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val))}
      >
        <SelectTrigger className="h-9 w-[160px] border-gray-200 bg-white text-sm">
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