import { TaskEntity } from '@/domain/entities/task.entity';
import { TaskRepositoryInterface } from '@/domain/repositories/task-repository.interface';
import { PostgresService } from '@/infrastructure/services/postgres.service';

export class TaskPgRepository implements TaskRepositoryInterface {
  constructor(private readonly postgresService: PostgresService) {}

  async save(task: TaskEntity): Promise<string> {
    const client = this.postgresService.getClient();
    const query = `
      INSERT INTO tasks (id, payload, priority, status, result, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
    const res = await client.query(query, [
      task.id,
      task.payload,
      task.priority,
      task.status,
      task.result,
      task.createdAt,
      task.updatedAt,
    ]);

    return res.rows[0]?.id ?? null;
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const client = this.postgresService.getClient();
    const query = `
      SELECT id, payload, priority, status, result, created_at, updated_at
      FROM tasks
      WHERE id = $1
    `;
    const res = await client.query(query, [id]);
    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return new TaskEntity(
      row.payload,
      row.priority,
      row.id,
      row.status,
      row.result,
      row.created_at,
      row.updated_at,
    );
  }

  async update(task: TaskEntity): Promise<TaskEntity> {
    const client = this.postgresService.getClient();
    const query = `
      UPDATE tasks
      SET status = $1, result = $2, updated_at = $3
      WHERE id = $4
      `;
    const res = await client.query(query, [
      task.status,
      task.result,
      task.updatedAt,
      task.id,
    ]);

    if (res.rowCount === 0) {
      throw new Error('Task not found');
    }
    return new TaskEntity(
      task.payload,
      task.priority,
      task.id,
      task.status,
      task.result,
    );
  }
}
