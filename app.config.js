module.exports = ({ config }) => ({
  ...config,
  version: '1.2.0',
  extra: {
    ...config.extra,
    commitHash:
      process.env.EAS_BUILD_GIT_COMMIT_HASH ||
      process.env.GITHUB_SHA ||
      'Hash disponível após configurar o build pelo EAS',
  },
});
