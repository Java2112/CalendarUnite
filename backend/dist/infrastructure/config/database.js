"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.testDbConnection = testDbConnection;
// Importa el pool de conexiones de PostgreSQL
const pg_1 = require("pg");
// Importa las variables de entorno validadas
const environment_vars_1 = __importDefault(require("./environment-vars"));
// Crea el pool de conexiones a la base de datos PostgreSQL
exports.pool = new pg_1.Pool({
    // Host o dirección del servidor PostgreSQL
    host: environment_vars_1.default.DB_HOST,
    // Puerto de conexión (5432)
    port: environment_vars_1.default.DB_PORT,
    // Usuario de la base de datos
    user: environment_vars_1.default.DB_USER,
    // Contraseña de la base de datos
    password: environment_vars_1.default.DB_PASSWORD,
    // Nombre de la base de datos
    database: environment_vars_1.default.DB_NAME,
    // Máximo número de conexiones en el pool
    max: 10,
    // Tiempo de inactividad antes de cerrar conexión (ms)
    idleTimeoutMillis: 30000,
    // Tiempo máximo para esperar una conexión libre (ms)
    connectionTimeoutMillis: 3000
});
// Función para probar la conectividad a la base de datos
async function testDbConnection() {
    // Inicia bloque de prueba de conexión
    try {
        // Solicita un cliente al pool
        const client = await exports.pool.connect();
        // Registra éxito en consola
        console.log(`[Database] Conexión exitosa a PostgreSQL en ${environment_vars_1.default.DB_HOST}:${environment_vars_1.default.DB_PORT} (Base de datos: ${environment_vars_1.default.DB_NAME})`);
        // Libera el cliente de vuelta al pool
        client.release();
        // Retorna true indicando conexión exitosa
        return true;
    }
    catch (error) {
        // Imprime el mensaje de error si falla la conexión
        console.error(`[Database Error] No se pudo conectar a la base de datos PostgreSQL:`, error.message);
        // Retorna false indicando fallo
        return false;
    }
}
