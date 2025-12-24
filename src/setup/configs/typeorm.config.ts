import { DataSourceOptions, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { envConfig as eC } from './env.config';

/**
 * Function to configure the database options, with the correct typing
 *
 * A fallback was implemented to ensure that, in case the configuration variables are not provided via
 * `ConfigService`, the values from the `envConfig` file will be used.
 * This is useful, for example, when generating migrations through terminal commands,
 * where `ConfigService` may not always be available or properly configured.
 */
export const createDatabaseConfig = (cS: ConfigService): DataSourceOptions => ({
  type: 'postgres', // Database type
  host: cS.get('database.host') ?? eC.database.host,
  port: cS.get('database.port') ?? eC.database.port,
  username: cS.get('database.username') ?? eC.database.username,
  password: cS.get('database.password') ?? eC.database.password,
  database: cS.get('database.database') ?? eC.database.database,
  synchronize: cS.get('database.synchronize') ?? eC.database.synchronize,
  logging: cS.get('database.logging') ?? eC.database.logging,
  migrations: [cS.get('database.migrations')! ?? eC.database.migrations],
  entities: [cS.get('database.entities')! ?? eC.database.entities],
});

// Function to create the DataSource with the configurations
export const dataSource = new DataSource(
  createDatabaseConfig(new ConfigService()),
);
