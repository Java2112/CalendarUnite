import joi from 'joi';
import 'dotenv/config';

export type ReturnEnvironmentVars = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD?: string;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
};

type ValidationEnvironmentVars = {
  error: joi.ValidationError | undefined;
  value: ReturnEnvironmentVars;
};

function validateEnvVars(vars: NodeJS.ProcessEnv): ValidationEnvironmentVars {
  const envSchema = joi
    .object({
      PORT: joi.number().default(3000),
      DB_HOST: joi.string().default('localhost'),
      DB_PORT: joi.number().default(3306),
      DB_USER: joi.string().default('root'),
      DB_PASSWORD: joi.string().allow('').default(''),
      DB_NAME: joi.string().default('calendarunite'),
      JWT_SECRET: joi.string().default('super_secret_jwt_key_calendarunite_2026'),
      JWT_EXPIRES_IN: joi.string().default('8h'),
      CORS_ORIGIN: joi.string().default('http://localhost:4200')
    })
    .unknown(true);

  const { error, value } = envSchema.validate(vars);
  return { error, value };
}

const loadEnvVars = (): ReturnEnvironmentVars => {
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
export default envs;
