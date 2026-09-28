// Importa Joi para validar el esquema de variables de entorno
import joi from 'joi';
// Carga las variables definidas en el archivo .env en process.env
import 'dotenv/config';

// Tipo que define la estructura tipada de las variables de entorno
export type ReturnEnvironmentVars = {
  // Puerto de la aplicación
  PORT: number;
  // Host de la base de datos
  DB_HOST: string;
  // Puerto de la base de datos
  DB_PORT: number;
  // Usuario de la base de datos
  DB_USER: string;
  // Contraseña opcional de la base de datos
  DB_PASSWORD?: string;
  // Nombre de la base de datos
  DB_NAME: string;
  // Clave secreta para firmar tokens JWT
  JWT_SECRET: string;
  // Tiempo de expiración del token JWT
  JWT_EXPIRES_IN: string;
  // Origen permitido para CORS
  CORS_ORIGIN: string;
};

// Tipo interno para el resultado de validación de Joi
type ValidationEnvironmentVars = {
  // Error de validación si existe
  error: joi.ValidationError | undefined;
  // Valores tipados resultantes
  value: ReturnEnvironmentVars;
};

// Función que valida las variables de entorno usando el esquema Joi
function validateEnvVars(vars: NodeJS.ProcessEnv): ValidationEnvironmentVars {
  // Define el esquema y valores por defecto
  const envSchema = joi
    .object({
      // Valida el puerto HTTP
      PORT: joi.number().default(3000),
      // Valida el host de la BD
      DB_HOST: joi.string().default('localhost'),
      // Valida el puerto de la BD
      DB_PORT: joi.number().default(5432),
      // Valida el usuario de la BD
      DB_USER: joi.string().default('postgres'),
      // Valida la contraseña de la BD
      DB_PASSWORD: joi.string().allow('').default('1234'),
      // Valida el nombre de la BD
      DB_NAME: joi.string().default('calendarunite'),
      // Valida la clave secreta JWT
      JWT_SECRET: joi.string().default('super_secret_jwt_key_calendarunite_2026'),
      // Valida la expiración del JWT
      JWT_EXPIRES_IN: joi.string().default('8h'),
      // Valida el origen CORS permitido
      CORS_ORIGIN: joi.string().default('http://localhost:4200')
    })
    // Permite otras variables no especificadas
    .unknown(true);

  // Ejecuta la validación contra las variables recibidas
  const { error, value } = envSchema.validate(vars);
  // Retorna el error y los valores procesados
  return { error, value };
}

// Función que carga y valida las variables de entorno de la aplicación
const loadEnvVars = (): ReturnEnvironmentVars => {
  // Ejecuta la validación con process.env
  const result = validateEnvVars(process.env);
  // Si hay error de validación, lanza una excepción
  if (result.error) {
    throw new Error(result.error.message);
  }
  // Extrae los valores validados
  const value = result.value;
  // Retorna el objeto estructurado
  return {
    PORT: value.PORT,
    DB_HOST: value.DB_HOST,
    DB_PORT: value.DB_PORT,
    DB_USER: value.DB_USER,
    DB_PASSWORD: value.DB_PASSWORD ?? '',
    DB_NAME: value.DB_NAME,
    JWT_SECRET: value.JWT_SECRET,
    JWT_EXPIRES_IN: value.JWT_EXPIRES_IN,
    CORS_ORIGIN: value.CORS_ORIGIN
  };
};

// Carga las variables validadas en una constante
const envs = loadEnvVars();
// Exporta la configuración por defecto
export default envs;
