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

config.reporters = [
  'spec',
  ['junit', {
    outputDir: './results',
    outputFileFormat: () => 'wdio-junit.xml',
  }],
];

exports.config = config;
