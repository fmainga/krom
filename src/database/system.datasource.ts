/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { Users } from './entities/user.entity';
import { Contacts } from './entities/contact.entity';
import * as dotenv from 'dotenv';
dotenv.config();
export const SystemDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true, // False in production - Use Migrations instead
  entities: [Users, Contacts],
});
