import { useState, useEffect } from 'react';
import { PressureChart } from '@/components/PressureChart';
import { StatisticsCard } from '@/components/StatisticsCard';
import { TimeRangeSelector } from '@/components/TimeRangeSelector';
import { pressureApi } from '@/services/api';
import type { PressureData, Statistics } from '@/types';
import { RefreshCw, Activity } from 'lucide-react';

function App() {
  // 状态管理
  const [timeRange, setTimeRange] = useState<number>(60); // 默认1小时
  const [historyData, setHistoryData] = useState<PressureData[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [latestData, setLatestData] = useState<PressureData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 获取历史数据
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

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const stats = await pressureApi.getStatistics(timeRange);
      setStatistics(stats);
    } catch (err) {
      console.error('获取统计数据失败:', err);
    }
  };

  // 获取最新数据
  const fetchLatestData = async () => {
    try {
      const data = await pressureApi.getLatestData();
      setLatestData(data);
    } catch (err) {
      console.error('获取最新数据失败:', err);
    }
  };

  // 获取所有数据
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

  // 初始化和时间范围变化时获取数据
  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  // 设置轮询（每3秒）
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 3000);

    return () => clearInterval(interval);
  }, [timeRange]);

  // 手动刷新
  const handleRefresh = () => {
    fetchAllData();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 头部 */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Activity className="h-8 w-8 text-primary" />
                压强监控系统
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                物理实验实时数据监控
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 时间范围选择器 */}
        <div className="mb-8 flex justify-end">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {/* 加载状态 */}
        {loading && historyData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">加载数据中...</p>
            </div>
          </div>
        ) : (
          <>
            {/* 统计卡片 */}
            {statistics && latestData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <StatisticsCard
                  title="环境压强传感器"
                  description="测量范围: 30,000 - 110,000 Pa"
                  stats={statistics.sensor1}
                  currentValue={latestData.sensor1}
                  unit="Pa"
                  color="#3b82f6"
                />
                <StatisticsCard
                  title="真空压强传感器"
                  description="测量范围: -30,000 - 0 Pa"
                  stats={statistics.sensor2}
                  currentValue={latestData.sensor2}
                  unit="Pa"
                  color="#ef4444"
                />
              </div>
            )}

            {/* 图表 */}
            <div className="grid grid-cols-1 gap-8">
              <PressureChart
                data={historyData}
                sensorKey="sensor1"
                title="环境压强曲线"
                description="实时监测环境压强变化"
                color="#3b82f6"
                unit="Pa"
                yAxisDomain={[30000, 110000]}
              />
              <PressureChart
                data={historyData}
                sensorKey="sensor2"
                title="真空压强曲线"
                description="实时监测真空盒子内压强变化"
                color="#ef4444"
                unit="Pa"
                yAxisDomain={[-30000, 0]}
              />
            </div>

            {/* 数据点数量 */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              当前显示 {historyData.length} 个数据点
            </div>
          </>
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-border/40 mt-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          <p>物理实验压强监控系统 © 2025</p>
          <p className="mt-1">数据每 3 秒自动更新</p>
        </div>
      </footer>
    </div>
  );
}

export default App;