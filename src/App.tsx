import { useState, useEffect } from 'react';
import { PressureChart } from '@/components/PressureChart';
import { StatisticsCard } from '@/components/StatisticsCard';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { pressureApi } from '@/services/api';
import type { PressureData, Statistics } from '@/types';
import { Activity, Gauge } from 'lucide-react';

function App() {
  const [timeRange, setTimeRange] = useState<number>(60);
  const [historyData, setHistoryData] = useState<PressureData[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [latestData, setLatestData] = useState<PressureData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchHistoryData = async () => {
    try {
      const data = await pressureApi.getHistoryData(timeRange);
      setHistoryData(data);
      setError(null);
    } catch (err) {
      console.error('获取历史数据失败:', err);
      setError('获取历史数据失败');
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await pressureApi.getStatistics(timeRange);
      setStatistics(stats);
    } catch (err) {
      console.error('获取统计数据失败:', err);
    }
  };

  const fetchLatestData = async () => {
    try {
      const data = await pressureApi.getLatestData();
      setLatestData(data);
    } catch (err) {
      console.error('获取最新数据失败:', err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchHistoryData(),
      fetchStatistics(),
      fetchLatestData(),
    ]);
    setLoading(false);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 3000);
    return () => clearInterval(interval);
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-900" />
            <div className="text-sm">
              <div className="font-semibold text-gray-900">压强监控系统</div>
              <div className="text-gray-500">物理实验 / 实时监控</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-xs text-gray-500">
              最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
            </div>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* 错误提示 */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* 加载状态 */}
          {loading && historyData.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <Activity className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">加载数据中...</p>
              </div>
            </div>
          ) : (
            <>
              {/* 顶部统计卡片 */}
              {statistics && latestData && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* 环境压强当前值 */}
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">环境压强</p>
                      <Gauge className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {latestData.sensor1.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Pa</p>
                    </div>
                  </div>

                  {/* 环境压强平均值 */}
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">环境平均</p>
                      <Activity className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics.sensor1.avg.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Pa</p>
                    </div>
                  </div>

                  {/* 真空压强当前值 */}
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">真空压强</p>
                      <Gauge className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {latestData.sensor2.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Pa</p>
                    </div>
                  </div>

                  {/* 真空压强平均值 */}
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">真空平均</p>
                      <Activity className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics.sensor2.avg.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Pa</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 详细统计卡片 */}
              {statistics && latestData && (
                <div className="grid gap-6 lg:grid-cols-2">
                  <StatisticsCard
                    title="环境压强传感器"
                    description="测量范围: 30,000 - 110,000 Pa"
                    stats={statistics.sensor1}
                    currentValue={latestData.sensor1}
                    unit="Pa"
                    color="#6b7280"
                  />
                  <StatisticsCard
                    title="真空压强传感器"
                    description="测量范围: -30,000 - 0 Pa"
                    stats={statistics.sensor2}
                    currentValue={latestData.sensor2}
                    unit="Pa"
                    color="#6b7280"
                  />
                </div>
              )}

              {/* 图表区域 */}
              <div className="grid gap-6 lg:grid-cols-2">
                <PressureChart
                  data={historyData}
                  sensorKey="sensor1"
                  title="环境压强趋势"
                  description="实时监测环境压强变化"
                  color="#3b82f6"
                  unit="Pa"
                  yAxisDomain={[30000, 110000]}
                />
                <PressureChart
                  data={historyData}
                  sensorKey="sensor2"
                  title="真空压强趋势"
                  description="实时监测真空盒子内压强变化"
                  color="#ef4444"
                  unit="Pa"
                  yAxisDomain={[-30000, 0]}
                />
              </div>

              {/* 数据点信息 */}
              <div className="rounded-lg border bg-white p-4 text-center">
                <p className="text-sm text-gray-500">
                  当前显示 <span className="font-medium text-gray-900">{historyData.length}</span> 个数据点
                  <span className="mx-2">·</span>
                  数据每 3 秒自动更新
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;