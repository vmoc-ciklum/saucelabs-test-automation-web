import SwagOverviewPage from '../page-objects/SwagOverviewPage';
import {setTestContext} from '../helpers/index';
import {LOGIN_USERS, PAGES} from '../configs/e2eConstants';

const PRICE_LOW_TO_HIGH = [
    'Sauce Labs Onesie',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Backpack',
    'Sauce Labs Fleece Jacket',
];

const PRICE_HIGH_TO_LOW = [
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Backpack',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Bike Light',
    'Sauce Labs Onesie',
];

// Seeded by the Story QA demo (demos/story-qa/seed.py suite). Each test title carries the Jira
// key of the test case it automates.
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

    it('[QG-53] sorts by Price (low to high) and Price (high to low) — standard_user', async () => {
        const user = LOGIN_USERS.STANDARD;

        await SwagOverviewPage.selectSortOption('lohi');

        let alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${user.username}: no alert on lohi`).toEqual(`${user.username}: alert was shown — ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);

        await SwagOverviewPage.selectSortOption('hilo');

        alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${user.username}: no alert on hilo`).toEqual(`${user.username}: alert was shown — ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_TO_LOW);
    });

    it('[QG-53] sorts by Price (low to high) and Price (high to low) — problem_user', async () => {
        const user = LOGIN_USERS.PROBLEM;
        await setTestContext({ user, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        let alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${user.username}: no alert on lohi`).toEqual(`${user.username}: alert was shown — ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);

        await SwagOverviewPage.selectSortOption('hilo');

        alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${user.username}: no alert on hilo`).toEqual(`${user.username}: alert was shown — ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_TO_LOW);
    });

    it('[QG-53] sorts by Price (low to high) and Price (high to low) — performance_glitch_user', async () => {
        const user = LOGIN_USERS.PERFORMANCE;
        await setTestContext({ user, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        let alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${user.username}: no alert on lohi`).toEqual(`${user.username}: alert was shown — ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);

        await SwagOverviewPage.selectSortOption('hilo');

        alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${user.username}: no alert on hilo`).toEqual(`${user.username}: alert was shown — ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_TO_LOW);
    });

    it('[QG-53] sorts by Price (low to high) and Price (high to low) — error_user', async () => {
        const user = LOGIN_USERS.ERROR;
        await setTestContext({ user, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        let alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${user.username}: no alert on lohi`).toEqual(`${user.username}: alert was shown — ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);

        await SwagOverviewPage.selectSortOption('hilo');

        alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${user.username}: no alert on hilo`).toEqual(`${user.username}: alert was shown — ${alertText}`);
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_TO_LOW);
    });
});
