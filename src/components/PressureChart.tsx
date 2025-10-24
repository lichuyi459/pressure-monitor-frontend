import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  // 格式化图表数据
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

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
          <p className="text-xs font-medium text-foreground mb-1">{data.time}</p>
          <p className="text-sm">
            <span className="text-muted-foreground">压强: </span>
            <span className="font-semibold" style={{ color }}>{data.value.toFixed(2)}</span> 
            <span className="text-xs text-muted-foreground ml-1">{unit}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              className="text-muted-foreground"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={0.5}
            />
            <YAxis
              domain={yAxisDomain}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              className="text-muted-foreground"
              tickFormatter={(value) => `${value.toFixed(0)}`}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={0.5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
              formatter={() => `压强 (${unit})`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              name={`压强 (${unit})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}