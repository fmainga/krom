/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Contacts {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  contact_id: number;
  @Column({ type: 'varchar', length: 50 })
  name: string;
  @Column({ type: 'varchar', length: 50 })
  phone_number: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (users) => users.contacts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user', referencedColumnName: 'user_id' })
  user: Users;
}
