// domain/entities/task.entity.ts
export class TaskEntity {
  constructor(
    public readonly id: string,
    public readonly payload: string,
  ) {}

  process(): { result: string; processedAt: Date } {
    const reversed = this.payload.split('').reverse().join('');
    const result = `${reversed}:${this.payload.length}`;
    return { result, processedAt: new Date() };
  }
}
