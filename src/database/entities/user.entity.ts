/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Contacts } from './contact.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  user_id: number;
  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;
  @Column({ type: 'varchar', length: 50 })
  fullname: string;
  @Column({ type: 'varchar', length: 100 })
  password: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @OneToMany(() => Contacts, (contacts) => contacts.user)
  contacts: Contacts[];
}
