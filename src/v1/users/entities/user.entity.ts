import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_reset_token?: string;

  @Column({ type: 'timestamp', nullable: true })
  password_reset_expires?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provider: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  social_id: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
