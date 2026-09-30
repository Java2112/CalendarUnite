"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerBootstrap = void 0;
// Importa el módulo nativo http de Node.js
const http_1 = __importDefault(require("http"));
// Importa la configuración de variables de entorno
const environment_vars_1 = __importDefault(require("../config/environment-vars"));
// Clase encargada de levantar y configurar el servidor HTTP
class ServerBootstrap {
    // Instancia de la aplicación Express
    app;
    // Constructor que recibe la aplicación Express configurada
    constructor(app) {
        // Asigna la app a la propiedad privada
        this.app = app;
    }
    // Método que inicia la escucha de peticiones HTTP en el puerto indicado
    initialize() {
        // Retorna una promesa para manejar la inicialización asíncrona
        return new Promise((resolve, reject) => {
            // Crea el servidor HTTP vinculándolo con la app Express
            const server = http_1.default.createServer(this.app);
            // Obtiene el puerto configurado o usa 3000 por defecto
            const PORT = Number(environment_vars_1.default.PORT ?? 3000);
            // Pone a escuchar el servidor en el puerto
            server.listen(PORT).on("listening", () => {
                // Imprime en consola que el servidor está corriendo
                console.log(`Server started on http://localhost:${PORT}`);
                // Resuelve la promesa exitosamente
                resolve(true);
            })
                // Maneja posibles errores al iniciar el servidor
                .on("error", (err) => {
                // Imprime el error capturado
                console.log(`Se ha generado un error: ${err}`);
                // Rechaza la promesa indicando fallo
                reject(false);
            });
        });
    }
}
exports.ServerBootstrap = ServerBootstrap;
