import mysql, { Pool } from 'mysql2/promise';
import envs from './environment-vars';

export const pool: Pool = mysql.createPool({
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  user: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true
});

export async function testDbConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Conexión exitosa a MySQL en ${envs.DB_HOST}:${envs.DB_PORT} (Base de datos: ${envs.DB_NAME})`);
    connection.release();
    return true;
  } catch (error: any) {
    console.error(`[Database Error] No se pudo conectar a la base de datos MySQL:`, error.message);
    return false;
  }
}
