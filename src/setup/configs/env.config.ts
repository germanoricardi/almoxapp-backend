import 'dotenv/config';

export const envConfig = {
  appPort: Number(process.env.APP_PORT),
  appSubject: process.env.APP_SUBJECT,

  // Database Settings
  database: {
    database: process.env.DB_NAME,
    entities: process.env.DB_ENTITIES,
    host: process.env.DB_HOST,
    logging: process.env.DB_LOGGING === 'true',
    migrations: process.env.DB_MIGRATIONS,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    seeds: process.env.DB_SEEDS,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    type: process.env.DB_TYPE,
    username: process.env.DB_USERNAME,
  },

  // JWT Settings
  jwt: {
    expirationTime: process.env.JWT_EXPIRATION_TIME,
    secret: process.env.JWT_SECRET,
    refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },

  // CORS Settings
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
  },

  // Rate Limiting Settings
  rateLimit: {
    ttl: Number(process.env.RATE_LIMIT_TTL),
    limit: Number(process.env.RATE_LIMIT_MAX),
  },

  // Password Reset Settings
  passwordReset: {
    url: process.env.PASSWORD_RESET_URL,
    expirationHour: Number(process.env.PASSWORD_RESET_EXPIRATION_HOUR),
  },

  // TODO Email Settings
  email: {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS,
    },
    from: process.env.EMAIL_FROM,
  },
};

export default () => ({
  ...envConfig,
});
