import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private totalTasks = 0;
  private totalProcessingTime = 0; // в миллисекундах

  recordTask(durationMs: number) {
    this.totalTasks += 1;
    this.totalProcessingTime += durationMs;
  }

  getMetrics() {
    const averageTime =
      this.totalTasks > 0 ? this.totalProcessingTime / this.totalTasks : 0;

    return {
      totalTasks: this.totalTasks,
      averageProcessingTimeMs: parseFloat(averageTime.toFixed(2)),
    };
  }
}
