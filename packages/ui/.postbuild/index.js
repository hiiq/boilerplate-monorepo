const { envCheck } = require('./envCheck');
const { makeRelease } = require('./makeRelease');
const { upload: sentryUpload } = require('./sentry');
const { upload: logRocketUpload } = require('./logRocket');

const main = async () => {
  envCheck();

  const release = makeRelease();

  // await sentryUpload(release);
  await logRocketUpload(release);

  console.log(`👍 Successfully ran postbuild step for v${release}`);
};

main();
