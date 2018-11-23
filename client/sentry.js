import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: 'https://d64e98a44eaf4bb8aef321476ed6626e@sentry.io/1329610' });

console.log('Initialized sentry client instance');
