const { version } = require('../package.json');

const { NODE_ENV } = process.env;

if (NODE_ENV === 'development') {
  console.log('Skipping prebuild step (NODE_ENV = development)');

  process.exit(0);
}

console.log(`👍 Successfully ran prebuild step for v${version}`);
