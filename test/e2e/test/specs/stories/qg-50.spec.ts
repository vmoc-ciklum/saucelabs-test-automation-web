import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import {assertNoAlert, setTestContext} from '../../helpers/index';
import {LOGIN_USERS, PAGES} from '../../configs/e2eConstants';

const PRICE_LOW_TO_HIGH = [
    { name: 'Sauce Labs Onesie',                 price: '$7.99'  },
    { name: 'Sauce Labs Bike Light',             price: '$9.99'  },
    { name: 'Sauce Labs Bolt T-Shirt',           price: '$15.99' },
    { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' },
    { name: 'Sauce Labs Backpack',               price: '$29.99' },
    { name: 'Sauce Labs Fleece Jacket',          price: '$49.99' },
];

const PRICE_HIGH_TO_LOW = [
    { name: 'Sauce Labs Fleece Jacket',          price: '$49.99' },
    { name: 'Sauce Labs Backpack',               price: '$29.99' },
    { name: 'Sauce Labs Bolt T-Shirt',           price: '$15.99' },
    { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' },
    { name: 'Sauce Labs Bike Light',             price: '$9.99'  },
    { name: 'Sauce Labs Onesie',                 price: '$7.99'  },
];

const NAME_A_TO_Z = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
];

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    it('[QG-84] Sort control offers exactly the four required options', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSortOptions()).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);
    });

    it('[QG-85] Catalogue opens sorted by Name (A to Z)', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z);
    });

    it('[QG-86] Price (high to low) uses descending price and the Name (A to Z) tie-breaker', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');
        await assertNoAlert();

        await expect(await SwagOverviewPage.getSwagNamesWithPrices()).toEqual(PRICE_HIGH_TO_LOW);
    });

    it('[QG-55] Catalogue sort resets after reload and persists when returning from product details', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        // Step 1 — sort Price (low to high)
        await SwagOverviewPage.selectSortOption('lohi');
        await assertNoAlert();
        await expect(await SwagOverviewPage.getSwagNamesWithPrices()).toEqual(PRICE_LOW_TO_HIGH);

        // Step 2 — open any product detail and go back; sort must survive navigation
        await SwagOverviewPage.openSwagDetails('Sauce Labs Onesie');
        await SwagDetailsPage.waitForIsShown();
        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Price (low to high)');
        await expect(await SwagOverviewPage.getSwagNamesWithPrices()).toEqual(PRICE_LOW_TO_HIGH);

        // Step 3 — reload resets to Name (A to Z)
        await browser.url(PAGES.SWAG_ITEMS);
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z);
    });

    it('[QG-87] Sorting works for every permitted shopping account and shows no alert or error', async () => {
        const accounts = [
            LOGIN_USERS.STANDARD,
            LOGIN_USERS.PROBLEM,
            LOGIN_USERS.PERFORMANCE,
            LOGIN_USERS.ERROR,
        ];

        for (const user of accounts) {
            const tag = user.username;

            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            // Step 1 — Price (high to low)
            await SwagOverviewPage.selectSortOption('hilo');
            await assertNoAlert();

            const selectedHilo = await SwagOverviewPage.getSelectedSortOption();
            await expect(`[${tag}] selected: ${selectedHilo}`).toEqual(`[${tag}] selected: Price (high to low)`);

            const itemsHilo = await SwagOverviewPage.getSwagNamesWithPrices();
            await expect({ user: tag, items: itemsHilo }).toEqual({ user: tag, items: PRICE_HIGH_TO_LOW });

            // Step 2 — Price (low to high)
            await SwagOverviewPage.selectSortOption('lohi');
            await assertNoAlert();

            const selectedLohi = await SwagOverviewPage.getSelectedSortOption();
            await expect(`[${tag}] selected: ${selectedLohi}`).toEqual(`[${tag}] selected: Price (low to high)`);

            const itemsLohi = await SwagOverviewPage.getSwagNamesWithPrices();
            await expect({ user: tag, items: itemsLohi }).toEqual({ user: tag, items: PRICE_LOW_TO_HIGH });
        }
    });
});
