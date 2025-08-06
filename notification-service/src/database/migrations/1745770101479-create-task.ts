import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationTable1691234567891
  implements MigrationInterface
{
  name = 'CreateNotificationTable1691234567891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание ENUM-типов
    await queryRunner.query(`
      CREATE TYPE notification_status_enum AS ENUM ('pending', 'sent', 'retrying', 'read', 'failed')
    `);

    await queryRunner.query(`
      CREATE TYPE notification_type_enum AS ENUM ('email', 'sms', 'push')
    `);

    // Создание таблицы
    await queryRunner.query(`
      CREATE TABLE notifications (
        id UUID PRIMARY KEY,
        message TEXT NOT NULL,
        user_id UUID NOT NULL,
        type notification_type_enum NOT NULL DEFAULT 'sms',
        status notification_status_enum NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS notifications`);
    await queryRunner.query(`DROP TYPE IF EXISTS notification_type_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS notification_status_enum`);
  }
}
