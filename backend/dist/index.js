"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importa la función que crea la app Express configurada
const app_1 = require("./infrastructure/web/app");
// Importa la clase que inicializa y levanta el servidor HTTP
const server_bootstrap_1 = require("./infrastructure/bootstrap/server.bootstrap");
// Importa la función que prueba la conexión con la base de datos
const database_1 = require("./infrastructure/config/database");
// Función principal asíncrona que arranca todo el backend
async function bootstrap() {
    // Prueba la conexión con la base de datos MySQL antes de continuar
    await (0, database_1.testDbConnection)();
    // Crea la instancia de la aplicación Express con todas sus rutas y middlewares
    const app = (0, app_1.createApp)();
    // Crea el servidor HTTP y lo inicializa en el puerto configurado
    const server = new server_bootstrap_1.ServerBootstrap(app);
    await server.initialize();
}
// Llama a bootstrap() y captura cualquier error fatal que impida el inicio
bootstrap().catch((error) => {
    // Imprime el error en consola y detiene el proceso con código de error 1
    console.error('[Fatal Error] Error al iniciar la aplicación:', error);
    process.exit(1);
});
