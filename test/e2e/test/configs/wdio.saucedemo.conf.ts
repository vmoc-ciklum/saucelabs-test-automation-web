import { config } from './wdio.shared.conf';

config.baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com';

config.capabilities = [
  {
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: [
        '--no-sandbox',
        '--disable-infobars',
        '--disable-features=SafeBrowsing,PasswordLeakToggleMove',
        '--headless',
        '--disable-gpu',
      ],
      prefs: {
        'profile.password_manager_leak_detection': false,
      },
    },
  },
];

config.services = config.services.concat('chromedriver');

// Extend the shared reporters (don't replace them, so a future shared default
// survives). Per-worker filename keyed on the WDIO capability id (cid) so
// parallel workers don't overwrite a single file — Jenkins globs results/*.xml.
config.reporters = [
  ...(config.reporters as any[]),
  ['junit', {
    outputDir: './results',
    outputFileFormat: ({ cid }: { cid: string }) => `wdio-junit-${cid}.xml`,
  }],
];

exports.config = config;
