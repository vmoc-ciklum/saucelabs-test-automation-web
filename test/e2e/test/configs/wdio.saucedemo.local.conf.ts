import { config } from './wdio.saucedemo.conf';

// The saucedemo config pins the `chromedriver` npm package (149.x) to match the
// Chrome for Testing build inside the Jenkins container. That pin is correct for
// CI and must not be bumped — but it makes the suite unrunnable on any developer
// machine whose desktop Chrome has moved on, and every spec dies at session
// creation with "This version of ChromeDriver only supports Chrome version 149".
//
// This sibling config inherits EVERYTHING from the saucedemo config (baseUrl,
// capabilities, parallelism, reporters) and drops only the pinned service, so
// WebdriverIO 9's built-in driver management downloads a driver matching whatever
// Chrome is actually installed. Local runs therefore stay as close to CI as the
// driver allows, which matters because QA Guardian's pre-PR suite gate runs here.
config.services = (config.services as string[]).filter((service) => service !== 'chromedriver');

exports.config = config;
