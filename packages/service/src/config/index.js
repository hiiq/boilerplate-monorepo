import { Utils } from '@boilerplate-monorepo/common';
import 'dotenv/config';
import {
  always,
  both,
  complement,
  defaultTo,
  either,
  evolve,
  isEmpty,
  mergeLeft,
  pick,
  pipe,
  prop,
  startsWith,
  mergeRight,
} from 'ramda';
import { ProcessEnvKeys } from 'types/processEnv';

// eslint-disable-next-line no-process-env
const raw = pick(ProcessEnvKeys.values, process.env);

const defaults = {
  ACCESS_TOKEN_EXPIRY: '5m',
  ACCESS_TOKEN_SECRET: 'auth-token-secret',
  CAPTCHA_SECRET: '0x0000000000000000000000000000000000000000',
  DATABASE_URL: '',
  DB_MIGRATION_SCHEMA: 'public',
  DB_MIGRATION_TABLE_NAME: 'migrations',
  DB_SCHEMA: 'main',
  DEBUG: `${raw.npm_package_name}*`,
  EMAIL_FROM_ADDRESS: `noreply@example.com`,
  EMAIL_FROM_NAME: 'No Reply',
  ENGINE_API_KEY: '',
  ENGINE_SCHEMA_TAG: 'local',
  HTTPS: true,
  NODE_ENV: 'development',
  PORT: 4000,
  REDIS_URL: '',
  REFRESH_TOKEN_EXPIRY: '7d',
  REFRESH_TOKEN_SECRET: 'refresh-token-secret',
  SHOW_CONFIG: false,
  SMTP_CONNECTION: '',
  UI_HOST_URI: '',
};

const config = mergeRight(defaults, raw);

const isDev = always(
  pipe(prop('NODE_ENV'), defaultTo(''), startsWith('dev'))(config)
);

const isProd = always(
  pipe(prop('NODE_ENV'), defaultTo(''), startsWith('prod'))(config)
);

const isUndefined = value => typeof value === 'undefined';
const isUndefinedOrEmpty = either(isUndefined, isEmpty);
const isNotDevAndEmpty = both(complement(isDev), isUndefinedOrEmpty);

const requiredEnvVars = [
  {
    failureTest: isUndefinedOrEmpty,
    name: 'DATABASE_URL',
  },
  {
    failureTest: isNotDevAndEmpty,
    name: 'REDIS_URL',
  },
];

const missingEnvVars = requiredEnvVars.filter(({ name, failureTest }) =>
  failureTest(config[name])
);

if (missingEnvVars.length) {
  const messages = missingEnvVars.map(
    ({ name }) => `${name} was not set. It is required to run the application`
  );

  // eslint-disable-next-line no-console
  console.error(messages.join('\n'));

  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

const merged = pipe(
  evolve({
    HTTPS: Utils.toBool,
    PORT: Utils.toNumber,
    SHOW_CONFIG: Utils.toBool,
  }),
  mergeLeft({
    isDev: isDev(),
    isProd: isProd(),
  })
)(config);

// eslint-disable-next-line no-console
merged.SHOW_CONFIG && console.log(JSON.stringify(merged, null, 2));

export { config };
