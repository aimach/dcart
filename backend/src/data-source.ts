import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'myapp',
  synchronize: true, // Crée automatiquement les tables (pratique en dev)
  logging: true,     // Active les logs pour le debug
  entities: [__dirname + '/entities/*.ts']
});
