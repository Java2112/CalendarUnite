// Importa el framework express y sus tipos
import express from "express";
// Importa el módulo nativo http de Node.js
import http from "http";
// Importa la configuración de variables de entorno
import envs from '../config/environment-vars';

// Clase encargada de levantar y configurar el servidor HTTP
export class ServerBootstrap {
  // Instancia de la aplicación Express
  private app: express.Application;

  // Constructor que recibe la aplicación Express configurada
  constructor(app: express.Application) {
    // Asigna la app a la propiedad privada
    this.app = app;
  }

  // Método que inicia la escucha de peticiones HTTP en el puerto indicado
  initialize(): Promise<boolean> {
    // Retorna una promesa para manejar la inicialización asíncrona
    return new Promise((resolve, reject) => {
      // Crea el servidor HTTP vinculándolo con la app Express
      const server = http.createServer(this.app);
      // Obtiene el puerto configurado o usa 3000 por defecto
      const PORT = Number(envs.PORT ?? 3000);
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
