import { NotificationEntity } from '@/domain/entities/notification.entity';
import { NotificationRepositoryInterface } from '@/domain/repositories/notification-repository.interface';
import { PostgresService } from '@/infrastructure/services/postgres.service';

export class NotificationPgRepository
  implements NotificationRepositoryInterface
{
  constructor(private readonly postgresService: PostgresService) {}

  async save(notification: NotificationEntity): Promise<string> {
    const client = this.postgresService.getClient();
    const query = `
      INSERT INTO notifications (id, message, user_id, type, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const res = await client.query(query, [
      notification.id,
      notification.message,
      notification.userId,
      notification.type,
      notification.status,
      notification.createdAt,
      notification.updatedAt,
    ]);

    return res.rows[0]?.id ?? null;
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    const client = this.postgresService.getClient();
    const query = `
      SELECT id, message, user_id, type, status, created_at, updated_at
      FROM notifications
      WHERE id = $1
    `;
    const res = await client.query(query, [id]);
    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return new NotificationEntity(
      row.message,
      row.user_id,
      row.type,
      row.status,
      row.id,
      row.created_at,
      row.updated_at,
    );
  }

  async update(notification: NotificationEntity): Promise<NotificationEntity> {
    const client = this.postgresService.getClient();
    const query = `
      UPDATE notifications
      SET status = $1, updated_at = $2
      WHERE id = $3
    `;
    const res = await client.query(query, [
      notification.status,
      notification.updatedAt,
      notification.id,
    ]);

    if (res.rowCount === 0) {
      throw new Error(`Notification with id "${notification.id}" not found`);
    }

    return notification;
  }
}
