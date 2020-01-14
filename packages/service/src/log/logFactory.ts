import 'dotenv/config';
import debug from 'debug';

class LogFactoryOptions {
  method: string;
  module: string;
}

const logs: any = {};

const makeNamespace = ({ method, module }: LogFactoryOptions) =>
  `${process.env.npm_package_name}/${module}.${method}`;

const monkeyPatchTimestamp = (logFn: Function) => (
  message: string,
  ...args: any[]
) =>
  args.length
    ? logFn(`${new Date().toISOString()}: ${message}`, JSON.stringify(args))
    : logFn(`${new Date().toISOString()}: ${message}`);

const logFactory = (options: LogFactoryOptions) => {
  const namespace = makeNamespace(options);

  if (logs[namespace]) {
    return logs[namespace];
  }

  const log = monkeyPatchTimestamp(debug(namespace));

  logs[namespace] = log;

  return log;
};

export { logFactory };