import SwagOverviewPage from '../page-objects/SwagOverviewPage';
import {setTestContext} from '../helpers/index';
import {LOGIN_USERS, PAGES} from '../configs/e2eConstants';

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

    it('[QG-53] sorts by Price (low to high)', async () => {
        const eligibleUsers = [
            LOGIN_USERS.STANDARD,
            LOGIN_USERS.PROBLEM,
            LOGIN_USERS.PERFORMANCE,
            LOGIN_USERS.ERROR,
        ];
        const expectedOrder = [
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
        ];

        for (const user of eligibleUsers) {
            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('lohi');

            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: no alert expected`).toEqual(`alert shown: "${alertText}"`);
            }

            await expect(
                await SwagOverviewPage.getSelectedSortOption(),
                `${user.username}: sort control`
            ).toEqual('Price (low to high)');

            await expect(
                await SwagOverviewPage.getSwagNames(),
                `${user.username}: product order`
            ).toEqual(expectedOrder);
        }
    });
});
