import SwagOverviewPage from '../page-objects/SwagOverviewPage';
import {setTestContext} from '../helpers/index';
import {LOGIN_USERS, PAGES} from '../configs/e2eConstants';

// Seeded by the Story QA demo (demos/story-qa/seed.py suite). Each test title carries the Jira
// key of the test case it automates.
describe('Swag items sorting', () => {
    describe('default and name-based sorts', () => {
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

    it('[QG-53] sorts by Price (low to high) — standard_user', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();
        await SwagOverviewPage.selectSortOption('lohi');
        const alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect('standard_user: alert shown — ' + alertText).toEqual('standard_user: no alert shown');
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

    it('[QG-53] sorts by Price (low to high) — problem_user', async () => {
        await setTestContext({user: LOGIN_USERS.PROBLEM, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();
        await SwagOverviewPage.selectSortOption('lohi');
        const alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect('problem_user: alert shown — ' + alertText).toEqual('problem_user: no alert shown');
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

    it('[QG-53] sorts by Price (low to high) — performance_glitch_user', async () => {
        await setTestContext({user: LOGIN_USERS.PERFORMANCE, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();
        await SwagOverviewPage.selectSortOption('lohi');
        const alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect('performance_glitch_user: alert shown — ' + alertText).toEqual('performance_glitch_user: no alert shown');
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

    it('[QG-53] sorts by Price (low to high) — error_user', async () => {
        await setTestContext({user: LOGIN_USERS.ERROR, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();
        await SwagOverviewPage.selectSortOption('lohi');
        const alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect('error_user: alert shown — ' + alertText).toEqual('error_user: no alert shown');
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
});
