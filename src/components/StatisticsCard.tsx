import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SensorStatistics } from '@/types';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  description: string;
  stats: SensorStatistics;
  currentValue?: number;
  unit?: string;
  color?: string;
}

export function StatisticsCard({
  title,
  description,
  stats,
  currentValue,
  unit = 'Pa',
  color = '#3b82f6',
}: StatisticsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
          {/* 当前值 */}
          {currentValue !== undefined && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" style={{ color }} />
                <span className="text-sm font-medium text-muted-foreground">当前值</span>
              </div>
              <span className="text-3xl font-bold tracking-tight" style={{ color }}>
                {currentValue.toFixed(2)} <span className="text-base font-normal text-muted-foreground">{unit}</span>
              </span>
            </div>
          )}

          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-4">
            {/* 最大值 */}
            <div className="flex flex-col items-center p-4 rounded-lg border border-border/50 bg-background transition-colors hover:bg-muted/30">
              <div className="flex items-center gap-1 text-green-600 mb-2">
                <ArrowUp className="h-4 w-4" />
                <span className="text-xs font-medium">最大</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                {stats.max.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground mt-1">{unit}</span>
            </div>

            {/* 最小值 */}
            <div className="flex flex-col items-center p-4 rounded-lg border border-border/50 bg-background transition-colors hover:bg-muted/30">
              <div className="flex items-center gap-1 text-red-600 mb-2">
                <ArrowDown className="h-4 w-4" />
                <span className="text-xs font-medium">最小</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                {stats.min.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground mt-1">{unit}</span>
            </div>

            {/* 平均值 */}
            <div className="flex flex-col items-center p-4 rounded-lg border border-border/50 bg-background transition-colors hover:bg-muted/30">
              <div className="flex items-center gap-1 text-blue-600 mb-2">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-medium">平均</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                {stats.avg.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground mt-1">{unit}</span>
            </div>
          </div>
      </CardContent>
    </Card>
  );
}