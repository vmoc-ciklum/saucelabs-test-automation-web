import { config } from './wdio.shared.conf';

config.baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com';

// The shared config sets maxInstances: 100. In CI (especially the demo's
// Jenkins controller running x86 Chrome under emulation), that many parallel
// headless Chromes saturate CPU and saucedemo navigations time out — green
// specs flake red for infra reasons. Cap parallelism to a couple of workers
// (overridable for fast local runs). A handful of login/checkout specs don't
// need 100-way fan-out.
config.maxInstances = Number(process.env.MAX_INSTANCES) || 2;

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
        // Chrome writes renderer heaps to /dev/shm; containers default to 64 MB
        // and tabs crash under parallelism. This makes the suite robust on any
        // host regardless of the container's shm size (the demo's compose also
        // bumps shm_size as a second layer).
        '--disable-dev-shm-usage',
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
