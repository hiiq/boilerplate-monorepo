const { ESLINT_MODES, whenDev, whenProd } = require('@craco/craco');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  babel: {
    plugins: [
      'add-react-displayname',
      ['babel-plugin-styled-components', { ssr: false }],
      ...whenDev(() => [['react-refresh/babel', { skipEnvCheck: true }]], []),
      ...whenProd(() => ['babel-plugin-jsx-remove-data-test-id'], []),
    ],
  },
  eslint: {
    loaderOptions: (eslintOptions) => ({
      ...eslintOptions,
      eslintPath: require.resolve('eslint'),
    }),
    mode: ESLINT_MODES.file,
  },
  webpack: {
    configure: (webpackConfig) => ({
      ...webpackConfig,
      optimization: {
        ...webpackConfig.optimization,
        splitChunks: {
          cacheGroups: {
            vendor: {
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const { context } = module;

                const [, packageName] = context.match(
                  // eslint-disable-next-line prefer-named-capture-group
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/u
                );

                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`;
              },
              test: /[\\/]node_modules[\\/]/u,
            },
          },
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
        },
      },
      plugins: [
        ...(webpackConfig.plugins || []),
        ...whenDev(() => [new ReactRefreshPlugin({ overlay: false })], []),
      ],
    }),
  },
};
