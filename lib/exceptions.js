import * as Sentry from '@sentry/node';

export function captureException(e, consoleIdentifier = '') {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(e);
  } else {
    console.error('!!> captureException:', e);
  }
}
