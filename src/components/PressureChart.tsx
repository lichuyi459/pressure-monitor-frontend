import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PressureData } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PressureChartProps {
  data: PressureData[];
  sensorKey: 'sensor1' | 'sensor2';
  title: string;
  description: string;
  color: string;
  unit?: string;
  yAxisDomain?: [number, number] | ['auto', 'auto'];
}

export function PressureChart({
  data,
  sensorKey,
  title,
  description,
  color,
  unit = 'Pa',
  yAxisDomain = ['auto', 'auto'],
}: PressureChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      value: item[sensorKey],
      timestamp: item.timestamp,
    }));
  }, [data, sensorKey]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="text-xs font-medium text-gray-900 mb-1">{data.time}</p>
          <p className="text-sm">
            <span className="text-gray-600">压强: </span>
            <span className="font-semibold text-gray-900">{data.value.toFixed(2)}</span> 
            <span className="text-xs text-gray-500 ml-1">{unit}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">{title}</CardTitle>
        <CardDescription className="text-xs text-gray-500">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickMargin={8}
              stroke="#d1d5db"
            />
            <YAxis
              domain={yAxisDomain}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickMargin={8}
              tickFormatter={(value) => `${value.toFixed(0)}`}
              stroke="#d1d5db"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 2, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}