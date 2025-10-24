// 压强数据类型
export interface PressureData {
  id: number;
  sensor1: number;  // 环境压强 (Pa)
  sensor2: number;  // 真空压强 (Pa)
  timestamp: string;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

// 统计数据类型
export interface SensorStatistics {
  max: number;
  min: number;
  avg: number;
}

export interface Statistics {
  sensor1: SensorStatistics;
  sensor2: SensorStatistics;
  count: number;
}

// 时间范围选项
export interface TimeRangeOption {
  label: string;
  value: number;  // 分钟数
}
