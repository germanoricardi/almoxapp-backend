import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Server Configurations
  APP_PORT: Joi.number().required(),
  APP_SUBJECT: Joi.string().required(),

  // Database Configurations
  DB_TYPE: Joi.string().valid('postgres').required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(true),
  DB_ENTITIES: Joi.string().required(),
  DB_MIGRATIONS: Joi.string().required(),

  // JWT Configurations
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),

  // Security Configurations (CORS)
  CORS_ORIGIN: Joi.string().required(), // Allowing all domains by default
  CORS_METHODS: Joi.string().default('GET,HEAD,PUT,PATCH,POST,DELETE'), // Allowed methods by default
  CORS_ALLOWED_HEADERS: Joi.string().default('Content-Type,Authorization'), // Allowed headers by default

  // Rate Limiting Configurations
  RATE_LIMIT_TTL: Joi.number().required().min(1), // Request window time (in seconds)
  RATE_LIMIT_MAX: Joi.number().required().min(1), // Maximum allowed requests in the time window

  // Password Reset Configurations
  PASSWORD_RESET_URL: Joi.string().uri().required(),
  PASSWORD_RESET_EXPIRATION_HOUR: Joi.number().integer().min(1).default(1),

  // Email Configurations
  EMAIL_HOST: Joi.string().hostname().required(),
  EMAIL_PORT: Joi.number().port().required(),
  EMAIL_SECURE: Joi.boolean().required().default(false),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASS: Joi.string().required(),
  EMAIL_FROM: Joi.string().email().required(),
});
