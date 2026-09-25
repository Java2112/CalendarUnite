"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.testDbConnection = testDbConnection;
const pg_1 = require("pg");
const environment_vars_1 = __importDefault(require("./environment-vars"));
exports.pool = new pg_1.Pool({
    host: environment_vars_1.default.DB_HOST,
    port: environment_vars_1.default.DB_PORT,
    user: environment_vars_1.default.DB_USER,
    password: environment_vars_1.default.DB_PASSWORD,
    database: environment_vars_1.default.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000
});
async function testDbConnection() {
    try {
        const client = await exports.pool.connect();
        console.log(`[Database] Conexión exitosa a PostgreSQL en ${environment_vars_1.default.DB_HOST}:${environment_vars_1.default.DB_PORT} (Base de datos: ${environment_vars_1.default.DB_NAME})`);
        client.release();
        return true;
    }
    catch (error) {
        console.error(`[Database Error] No se pudo conectar a la base de datos PostgreSQL:`, error.message);
        return false;
    }
}
