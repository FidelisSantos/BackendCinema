import { DataSource, DataSourceOptions } from 'typeorm';
import * as env from 'dotenv';

env.config();
export const typeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.HOST,
  port: +process.env.PORT,
  username: process.env.DB_USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
};

export const dataSource = new DataSource(typeOrmConfig);
