"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importa Joi para validar el esquema de variables de entorno
const joi_1 = __importDefault(require("joi"));
// Carga las variables definidas en el archivo .env en process.env
require("dotenv/config");
// Función que valida las variables de entorno usando el esquema Joi
function validateEnvVars(vars) {
    // Define el esquema y valores por defecto
    const envSchema = joi_1.default
        .object({
        // Valida el puerto HTTP
        PORT: joi_1.default.number().default(3000),
        // Valida el host de la BD
        DB_HOST: joi_1.default.string().default('localhost'),
        // Valida el puerto de la BD
        DB_PORT: joi_1.default.number().default(5432),
        // Valida el usuario de la BD
        DB_USER: joi_1.default.string().default('postgres'),
        // Valida la contraseña de la BD
        DB_PASSWORD: joi_1.default.string().allow('').default('1234'),
        // Valida el nombre de la BD
        DB_NAME: joi_1.default.string().default('calendarunite'),
        // Valida la clave secreta JWT
        JWT_SECRET: joi_1.default.string().default('super_secret_jwt_key_calendarunite_2026'),
        // Valida la expiración del JWT
        JWT_EXPIRES_IN: joi_1.default.string().default('8h'),
        // Valida el origen CORS permitido
        CORS_ORIGIN: joi_1.default.string().default('http://localhost:4200')
    })
        // Permite otras variables no especificadas
        .unknown(true);
    // Ejecuta la validación contra las variables recibidas
    const { error, value } = envSchema.validate(vars);
    // Retorna el error y los valores procesados
    return { error, value };
}
// Función que carga y valida las variables de entorno de la aplicación
const loadEnvVars = () => {
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
exports.default = envs;
