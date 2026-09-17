import SwagOverviewPage from '../page-objects/SwagOverviewPage';
import {setTestContext} from '../helpers/index';
import {LOGIN_USERS, PAGES} from '../configs/e2eConstants';

// Seeded by the Story QA demo (demos/story-qa/seed.py suite). Each test title carries the Jira
// key of the test case it automates.

const SHOPPING_USERS = [
    LOGIN_USERS.STANDARD,
    LOGIN_USERS.PROBLEM,
    LOGIN_USERS.PERFORMANCE,
    LOGIN_USERS.ERROR,
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

    for (const user of SHOPPING_USERS) {
        it(`[QG-53] sorts by Price (low to high) — ${user.username}`, async () => {
            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('lohi');

            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: alert — ${alertText}`).toEqual(`${user.username}: no alert`);
            }

            await expect(`${user.username}: ${(await SwagOverviewPage.getSwagNames()).join('|')}`).toEqual(
                `${user.username}: Sauce Labs Onesie|Sauce Labs Bike Light|Sauce Labs Bolt T-Shirt|Test.allTheThings() T-Shirt (Red)|Sauce Labs Backpack|Sauce Labs Fleece Jacket`
            );
            await expect(`${user.username}: ${(await SwagOverviewPage.getSwagPrices()).join('|')}`).toEqual(
                `${user.username}: $7.99|$9.99|$15.99|$15.99|$29.99|$49.99`
            );
        });
    }
});
