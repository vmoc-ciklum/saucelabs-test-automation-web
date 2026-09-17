import SwagOverviewPage from '../page-objects/SwagOverviewPage';
import {setTestContext} from '../helpers/index';
import {LOGIN_USERS, PAGES} from '../configs/e2eConstants';

// Seeded by the Story QA demo (demos/story-qa/seed.py suite). Each test title carries the Jira
// key of the test case it automates.

const PRICE_LOW_TO_HIGH = [
    'Sauce Labs Onesie',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Backpack',
    'Sauce Labs Fleece Jacket',
];

describe('Swag items sorting', () => {
    beforeEach(async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();
    });

    it('[QG-51] opens sorted by Name (A to Z)', async () => {
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ]);
    });

    it('[QG-52] sorts by Name (Z to A)', async () => {
        await SwagOverviewPage.selectSortOption('za');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Onesie',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Bike Light',
            'Sauce Labs Backpack',
        ]);
    });
});

describe('Swag items sorting — Price low to high, all eligible accounts (QG-53)', () => {
    it('[QG-53] sorts by Price (low to high) — standard_user', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();
        await SwagOverviewPage.selectSortOption('lohi');
        if (await browser.isAlertOpen()) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${LOGIN_USERS.STANDARD.username}: no alert`).toEqual(`no alert but got: ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);
    });

    it('[QG-53] sorts by Price (low to high) — problem_user', async () => {
        await setTestContext({ user: LOGIN_USERS.PROBLEM, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();
        await SwagOverviewPage.selectSortOption('lohi');
        if (await browser.isAlertOpen()) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${LOGIN_USERS.PROBLEM.username}: no alert`).toEqual(`no alert but got: ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);
    });

    it('[QG-53] sorts by Price (low to high) — performance_glitch_user', async () => {
        await setTestContext({ user: LOGIN_USERS.PERFORMANCE, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();
        await SwagOverviewPage.selectSortOption('lohi');
        if (await browser.isAlertOpen()) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${LOGIN_USERS.PERFORMANCE.username}: no alert`).toEqual(`no alert but got: ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);
    });

    it('[QG-53] sorts by Price (low to high) — error_user', async () => {
        await setTestContext({ user: LOGIN_USERS.ERROR, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();
        await SwagOverviewPage.selectSortOption('lohi');
        if (await browser.isAlertOpen()) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${LOGIN_USERS.ERROR.username}: no alert`).toEqual(`no alert but got: ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);
    });
});
