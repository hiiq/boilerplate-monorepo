import { Utils } from '@boilerplate-monorepo/common';
import 'dotenv/config';
import {
  always,
  both,
  complement,
  cond,
  defaultTo,
  either,
  evolve,
  includes,
  isEmpty,
  mergeRight,
  pick,
  pipe,
  prop,
  propOr,
  startsWith,
  T,
  toLower,
} from 'ramda';
import { ProcessEnvKeys } from 'types/processEnvKeys';

// eslint-disable-next-line no-process-env
const raw = pick(ProcessEnvKeys.values, process.env);

const defaults = {
  ACCESS_TOKEN_EXPIRY: '5m',
  ACCESS_TOKEN_SECRET: 'auth-token-secret',
  CAPTCHA_SECRET: '0x0000000000000000000000000000000000000000',
  CI: false,
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
  SENTRY_DSN: null,
  SHOW_CONFIG: false,
  SMTP_CONNECTION: '',
  UI_HOST_URI: 'https://local.host:3000',
};

const config = mergeRight(defaults, raw);

const normalize = pipe(prop('NODE_ENV'), defaultTo('development'), toLower);

const isTest = (env) =>
  includes(env, ['ci', 'jest', 'test']) ||
  (typeof describe !== 'undefined' && typeof test !== 'undefined');

const isDev = pipe(normalize, either(startsWith('dev'), startsWith('local')));
const isProd = pipe(normalize, either(startsWith('prod'), startsWith('prd')));
const isStaging = pipe(normalize, either(startsWith('sta'), startsWith('stg')));

const toEnvironment = pipe(
  normalize,
  cond([
    [isTest, always('test')],
    [isProd, always('production')],
    [isStaging, always('staging')],
    [T, always('development')],
  ])
);

const isSqlDebug = always(
  pipe(propOr('', ProcessEnvKeys.DEBUG), includes('sql'))
)(config);

const isUndefined = (value) => typeof value === 'undefined';
const isUndefinedOrEmpty = either(isUndefined, isEmpty);
const isNotDevAndEmpty = both(complement(isDev), isUndefinedOrEmpty);

const isTelemetryEnabled = pipe(
  propOr(false, ProcessEnvKeys.SENTRY_DSN),
  Boolean
);

const requiredEnvVars = [
  { failureTest: isUndefinedOrEmpty, name: ProcessEnvKeys.DATABASE_URL },
  { failureTest: isNotDevAndEmpty, name: ProcessEnvKeys.REDIS_URL },
];

const missingEnvVars = requiredEnvVars.filter(({ name, failureTest }) =>
  failureTest(config[name])
);

if (isProd(config) && missingEnvVars.length) {
  const messages = missingEnvVars.map(
    ({ name }) =>
      `${name} was not set. The application will not function correctly without it.`
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
  Utils.renameKeys({
    [ProcessEnvKeys.npm_package_name]: 'name',
    [ProcessEnvKeys.npm_package_version]: 'version',
  }),
  mergeRight({
    environment: toEnvironment(config),
    isDev: isDev(config),
    isProd: isProd(config),
    isSqlDebug: isSqlDebug(),
    isStaging: isStaging(config),
    isTelemetryEnabled: isTelemetryEnabled(config),
    isTest: isTest(config),
  })
)(config);

// eslint-disable-next-line no-console
merged.SHOW_CONFIG && console.log(JSON.stringify(merged, null, 2));

export { merged as config };
