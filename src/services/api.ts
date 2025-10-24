import type { ApiResponse, PressureData, Statistics } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class PressureApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * 获取指定时间范围内的历史数据
   * @param minutes 时间范围（分钟）
   */
  async getHistoryData(minutes: number): Promise<PressureData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/pressure/data?minutes=${minutes}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<PressureData[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取数据失败');
      }
      
      return result.data;
    } catch (error) {
      console.error('获取历史数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取最新数据
   */
  async getLatestData(): Promise<PressureData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pressure/data/latest`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<PressureData | null> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取最新数据失败');
      }
      
      return result.data;
    } catch (error) {
      console.error('获取最新数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取统计数据
   * @param minutes 时间范围（分钟）
   */
  async getStatistics(minutes: number): Promise<Statistics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/pressure/statistics?minutes=${minutes}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Statistics> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取统计数据失败');
      }
      
      return result.data;
    } catch (error) {
      console.error('获取统计数据失败:', error);
      throw error;
    }
  }

  /**
   * 上传数据（供 ESP32 使用）
   * @param sensor1 环境压强
   * @param sensor2 真空压强
   * @param timestamp 时间戳（可选）
   */
  async uploadData(
    sensor1: number,
    sensor2: number,
    timestamp?: string
  ): Promise<PressureData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pressure/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sensor1,
          sensor2,
          timestamp,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<PressureData> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '上传数据失败');
      }
      
      return result.data;
    } catch (error) {
      console.error('上传数据失败:', error);
      throw error;
    }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('健康检查失败:', error);
      return false;
    }
  }
}

// 导出单例
export const pressureApi = new PressureApiService();
