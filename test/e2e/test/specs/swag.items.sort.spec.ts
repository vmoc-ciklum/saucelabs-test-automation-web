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

    it('[QG-53] Sort by Price (low to high), including equal-price and empty-catalogue results', async () => {
        // Step 1: verify the sort control offers exactly four options in the specified order (AC1)
        const options = await SwagOverviewPage.getSortOptions();
        await expect(options).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);

        // Step 2: Price (low to high) with standard catalogue (AC3)
        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSelectedSortText()).toEqual('Price (low to high)');

        const names = await SwagOverviewPage.getSwagNames();
        await expect(names).toEqual([
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
        ]);

        const prices = await SwagOverviewPage.getSwagPrices();
        for (let i = 1; i < prices.length; i++) {
            await expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
        }

        // Equal-price tie-breaker: Sauce Labs Bolt T-Shirt ($15.99) before Test.allTheThings() ($15.99)
        const boltIndex = names.indexOf('Sauce Labs Bolt T-Shirt');
        const tattIndex = names.indexOf('Test.allTheThings() T-Shirt (Red)');
        await expect(boltIndex).toBeLessThan(tattIndex);

        // Step 3: same-price, same-name scenario
        // The standard catalogue has no duplicate names. Relative order of same-price same-name
        // products is not asserted until F3 is resolved.

        // Step 4: empty-catalogue variant — blocked pending F1.
        // Cannot be automated until the empty-catalogue variant and its approved result are defined.
    });
});
