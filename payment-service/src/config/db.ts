import { Client } from 'pg';

const client = new Client({
  host: 'postgres',
  port: 5432,
  user: 'admin',
  password: 'admin',
  database: 'ecommerce',
});

client.connect();

export default client;