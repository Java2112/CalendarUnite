import { Pool } from 'pg';
import envs from './environment-vars';

export const pool: Pool = new Pool({
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  user: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000
});

export async function testDbConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    console.log(`[Database] Conexión exitosa a PostgreSQL en ${envs.DB_HOST}:${envs.DB_PORT} (Base de datos: ${envs.DB_NAME})`);
    client.release();
    return true;
  } catch (error: any) {
    console.error(`[Database Error] No se pudo conectar a la base de datos PostgreSQL:`, error.message);
    return false;
  }
}
