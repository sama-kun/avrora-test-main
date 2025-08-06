import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTable1691234567890 implements MigrationInterface {
  name = 'CreateTaskTable1691234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE task_status_enum AS ENUM ('pending', 'processing', 'done', 'failed')
    `);

    await queryRunner.query(`
      CREATE TABLE tasks (
        id UUID PRIMARY KEY,
        payload TEXT NOT NULL,
        priority INTEGER NOT NULL,
        status task_status_enum NOT NULL DEFAULT 'pending',
        result TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tasks`);
    await queryRunner.query(`DROP TYPE IF EXISTS task_status_enum`);
  }
}
