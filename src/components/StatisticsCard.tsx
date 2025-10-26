import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SensorStatistics } from '@/types';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

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
}: StatisticsCardProps) {
  // 判断是否为负压传感器 (通过标题判断)
  const isNegativePressure = title.includes('真空');
  
  // 确保负压传感器的值显示为负数
  const formatValue = (value: number) => {
    if (isNegativePressure && value > 0) {
      return -value;
    }
    return value;
  };
  
  const displayCurrent = currentValue !== undefined ? formatValue(currentValue) : undefined;
  const displayAvg = formatValue(stats.avg);
  
  // 计算变化趋势
  const trend = displayCurrent !== undefined 
    ? ((displayCurrent - displayAvg) / Math.abs(displayAvg) * 100)
    : 0;

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">{title}</CardTitle>
        <CardDescription className="text-xs text-gray-500">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 当前值显示 */}
        {currentValue !== undefined && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">当前读数</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {currentValue.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">{unit}</span>
                </div>
              </div>
              
              {/* 趋势指示器 */}
              <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                trend > 0 
                  ? 'bg-green-100 text-green-700' 
                  : trend < 0 
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {trend > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3" />
                    <span>+{Math.abs(trend).toFixed(1)}%</span>
                  </>
                ) : trend < 0 ? (
                  <>
                    <TrendingDown className="h-3 w-3" />
                    <span>-{Math.abs(trend).toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <Activity className="h-3 w-3" />
                    <span>0.0%</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 统计数据网格 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 最大值 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-gray-600">最大值</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {stats.max.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">{unit}</p>
            </div>
          </div>

          {/* 平均值 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-xs font-medium text-gray-600">平均值</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {stats.avg.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">{unit}</p>
            </div>
          </div>

          {/* 最小值 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium text-gray-600">最小值</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {stats.min.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">{unit}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}