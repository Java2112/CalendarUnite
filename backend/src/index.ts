import { createApp } from './infrastructure/web/app';
import { ServerBootstrap } from './infrastructure/bootstrap/server.bootstrap';
import { testDbConnection } from './infrastructure/config/database';

async function bootstrap() {
  // Probar conectividad con la base de datos MySQL
  await testDbConnection();

  // Crear la aplicación de Express
  const app = createApp();

  // Inicializar servidor HTTP
  const server = new ServerBootstrap(app);
  await server.initialize();
}

bootstrap().catch((error) => {
  console.error('[Fatal Error] Error al iniciar la aplicación:', error);
  process.exit(1);
});
