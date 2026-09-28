// Importa el pool de conexiones de PostgreSQL
import { Pool } from 'pg';
// Importa las variables de entorno validadas
import envs from './environment-vars';

// Crea el pool de conexiones a la base de datos PostgreSQL
export const pool: Pool = new Pool({
  // Host o dirección del servidor PostgreSQL
  host: envs.DB_HOST,
  // Puerto de conexión (5432)
  port: envs.DB_PORT,
  // Usuario de la base de datos
  user: envs.DB_USER,
  // Contraseña de la base de datos
  password: envs.DB_PASSWORD,
  // Nombre de la base de datos
  database: envs.DB_NAME,
  // Máximo número de conexiones en el pool
  max: 10,
  // Tiempo de inactividad antes de cerrar conexión (ms)
  idleTimeoutMillis: 30000,
  // Tiempo máximo para esperar una conexión libre (ms)
  connectionTimeoutMillis: 3000
});

// Función para probar la conectividad a la base de datos
export async function testDbConnection(): Promise<boolean> {
  // Inicia bloque de prueba de conexión
  try {
    // Solicita un cliente al pool
    const client = await pool.connect();
    // Registra éxito en consola
    console.log(`[Database] Conexión exitosa a PostgreSQL en ${envs.DB_HOST}:${envs.DB_PORT} (Base de datos: ${envs.DB_NAME})`);
    // Libera el cliente de vuelta al pool
    client.release();
    // Retorna true indicando conexión exitosa
    return true;
  } catch (error: any) {
    // Imprime el mensaje de error si falla la conexión
    console.error(`[Database Error] No se pudo conectar a la base de datos PostgreSQL:`, error.message);
    // Retorna false indicando fallo
    return false;
  }
}
