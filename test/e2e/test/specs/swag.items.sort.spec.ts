import SwagOverviewPage from '../page-objects/SwagOverviewPage';
import {setTestContext} from '../helpers/index';
import {LOGIN_USERS, PAGES} from '../configs/e2eConstants';

// Accounts permitted to sign in and shop (QG-46), excluding visual_user (QG-47).
const SHOPPING_USERS = [
    LOGIN_USERS.STANDARD,
    LOGIN_USERS.PROBLEM,
    LOGIN_USERS.PERFORMANCE,
    LOGIN_USERS.ERROR,
];

// Seeded by the Story QA demo (demos/story-qa/seed.py suite). Each test title carries the Jira
// key of the test case it automates.
describe('Swag items sorting', () => {
    it('[QG-51] opens sorted by Name (A to Z)', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

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
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

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
            await setTestContext({
                user,
                path: PAGES.SWAG_ITEMS,
            });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('lohi');

            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: unexpected alert — ${alertText}`).toEqual(`${user.username}: no alert`);
            }

            await expect(await SwagOverviewPage.getSwagNames()).toEqual([
                'Sauce Labs Onesie',
                'Sauce Labs Bike Light',
                'Sauce Labs Bolt T-Shirt',
                'Test.allTheThings() T-Shirt (Red)',
                'Sauce Labs Backpack',
                'Sauce Labs Fleece Jacket',
            ]);
        });
    }
});
