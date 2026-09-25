"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
require("dotenv/config");
function validateEnvVars(vars) {
    const envSchema = joi_1.default
        .object({
        PORT: joi_1.default.number().default(3000),
        DB_HOST: joi_1.default.string().default('localhost'),
        DB_PORT: joi_1.default.number().default(5432),
        DB_USER: joi_1.default.string().default('postgres'),
        DB_PASSWORD: joi_1.default.string().allow('').default('1234'),
        DB_NAME: joi_1.default.string().default('calendarunite'),
        JWT_SECRET: joi_1.default.string().default('super_secret_jwt_key_calendarunite_2026'),
        JWT_EXPIRES_IN: joi_1.default.string().default('8h'),
        CORS_ORIGIN: joi_1.default.string().default('http://localhost:4200')
    })
        .unknown(true);
    const { error, value } = envSchema.validate(vars);
    return { error, value };
}
const loadEnvVars = () => {
    // validar los datos
    const result = validateEnvVars(process.env);
    if (result.error) {
        throw new Error(result.error.message);
    }
    const value = result.value;
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
const envs = loadEnvVars();
exports.default = envs;
