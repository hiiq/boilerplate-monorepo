import { values as rValues } from 'ramda';

const Enumeration = {
  ACCESS_TOKEN_EXPIRY: 'ACCESS_TOKEN_EXPIRY',
  ACCESS_TOKEN_SECRET: 'ACCESS_TOKEN_SECRET',
  CAPTCHA_SECRET: 'CAPTCHA_SECRET',
  CI: 'CI',
  DATABASE_URL: 'DATABASE_URL',
  DB_MIGRATION_SCHEMA: 'DB_MIGRATION_SCHEMA',
  DB_MIGRATION_TABLE_NAME: 'DB_MIGRATION_TABLE_NAME',
  DB_SCHEMA: 'DB_SCHEMA',
  DEBUG: 'DEBUG',
  EMAIL_FROM_ADDRESS: 'EMAIL_FROM_ADDRESS',
  EMAIL_FROM_NAME: 'EMAIL_FROM_NAME',
  HTTPS: 'HTTPS',
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  REDIS_URL: 'REDIS_URL',
  REFRESH_TOKEN_EXPIRY: 'REFRESH_TOKEN_EXPIRY',
  REFRESH_TOKEN_SECRET: 'REFRESH_TOKEN_SECRET',
  SENTRY_DSN: 'SENTRY_DSN',
  SHOW_CONFIG: 'SHOW_CONFIG',
  SMTP_CONNECTION: 'SMTP_CONNECTION',
  UI_HOST_URI: 'UI_HOST_URI',
  /* eslint-disable camelcase */
  npm_package_name: 'npm_package_name',
  npm_package_version: 'npm_package_version',
  /* eslint-enable camelcase */
};

const values = rValues(Enumeration);

export { Enumeration, values };
