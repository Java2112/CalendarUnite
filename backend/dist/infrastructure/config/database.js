"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.testDbConnection = testDbConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const environment_vars_1 = __importDefault(require("./environment-vars"));
exports.pool = promise_1.default.createPool({
    host: environment_vars_1.default.DB_HOST,
    port: environment_vars_1.default.DB_PORT,
    user: environment_vars_1.default.DB_USER,
    password: environment_vars_1.default.DB_PASSWORD,
    database: environment_vars_1.default.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
});
async function testDbConnection() {
    try {
        const connection = await exports.pool.getConnection();
        console.log(`[Database] Conexión exitosa a MySQL en ${environment_vars_1.default.DB_HOST}:${environment_vars_1.default.DB_PORT} (Base de datos: ${environment_vars_1.default.DB_NAME})`);
        connection.release();
        return true;
    }
    catch (error) {
        console.error(`[Database Error] No se pudo conectar a la base de datos MySQL:`, error.message);
        return false;
    }
}
