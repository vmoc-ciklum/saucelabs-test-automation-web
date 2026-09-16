import SwagOverviewPage from '../page-objects/SwagOverviewPage';
import {assertNoAlert, setTestContext} from '../helpers/index';
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
        await SwagOverviewPage.selectSortOption('lohi');
        await assertNoAlert();

        await expect(await SwagOverviewPage.getSwagNamesWithPrices()).toEqual([
            { name: 'Sauce Labs Onesie',                    price: '$7.99'  },
            { name: 'Sauce Labs Bike Light',                price: '$9.99'  },
            { name: 'Sauce Labs Bolt T-Shirt',              price: '$15.99' },
            { name: 'Test.allTheThings() T-Shirt (Red)',    price: '$15.99' },
            { name: 'Sauce Labs Backpack',                  price: '$29.99' },
            { name: 'Sauce Labs Fleece Jacket',             price: '$49.99' },
        ]);
    });
});
