"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./infrastructure/web/app");
const server_bootstrap_1 = require("./infrastructure/bootstrap/server.bootstrap");
const database_1 = require("./infrastructure/config/database");
async function bootstrap() {
    // Probar conectividad con la base de datos MySQL
    await (0, database_1.testDbConnection)();
    // Crear la aplicación de Express
    const app = (0, app_1.createApp)();
    // Inicializar servidor HTTP
    const server = new server_bootstrap_1.ServerBootstrap(app);
    await server.initialize();
}
bootstrap().catch((error) => {
    console.error('[Fatal Error] Error al iniciar la aplicación:', error);
    process.exit(1);
});
