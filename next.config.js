if (process.env.SENTRY_DSN) {
  require('@sentry/node').init({
    dsn: process.env.SENTRY_DSN
  });
}

module.exports = {
  env: {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN
  }
};
