import AppHeaderPage from '../../page-objects/AppHeaderPage';
import CartSummaryPage from '../../page-objects/CartSummaryPage';
import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import {setTestContext} from '../../helpers/index';
import {LOGIN_USERS, PAGES} from '../../configs/e2eConstants';

const PRICE_LOW_TO_HIGH_ORDER = [
    'Sauce Labs Onesie',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Backpack',
    'Sauce Labs Fleece Jacket',
];

const PRICE_HIGH_TO_LOW_ORDER = [
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Backpack',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Bike Light',
    'Sauce Labs Onesie',
];

const NAME_A_TO_Z_ORDER = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
];

async function assertNoAlert(label: string) {
    if (await browser.isAlertOpen()) {
        const alertText = await browser.getAlertText();
        await browser.acceptAlert();
        throw new Error(`[${label}] Unexpected alert when sorting: "${alertText}"`);
    }
}

describe('QG-50 Shopper sorts the catalogue by price', () => {
    it('[QG-55] Sort persistence across explicitly exercised catalogue boundaries', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        // Scenario A: navigate to cart and back resets sort to Name (A to Z)
        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSelectedSortText()).toEqual('Price (low to high)');
        const pricesBeforeLeaving = await SwagOverviewPage.getSwagPrices();
        for (let i = 1; i < pricesBeforeLeaving.length; i++) {
            await expect(pricesBeforeLeaving[i]).toBeGreaterThanOrEqual(pricesBeforeLeaving[i - 1]);
        }

        await AppHeaderPage.openCart();
        await CartSummaryPage.waitForIsShown();
        await CartSummaryPage.continueShopping();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortText()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z_ORDER);

        // Scenario B — blocked pending F5: verify whether returning from product details preserves
        //   or resets the sort control.
        // Scenario C — blocked pending F6: verify whether a page reload preserves or resets sort.
        // Scenario D — blocked pending F7: verify whether logout/login preserves or resets sort.
        // Scenario E — blocked pending F8: verify whether a new browser session preserves or resets sort.
        // Scenario F — blocked pending F9: verify whether the application reset control preserves
        //   or resets sort.
    });

    it('[QG-56] Sort by Price (high to low), including equal-price and empty-catalogue results', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        // Step 1: Price (high to low) with standard catalogue (AC4)
        await SwagOverviewPage.selectSortOption('hilo');
        await expect(await SwagOverviewPage.getSelectedSortText()).toEqual('Price (high to low)');

        const names = await SwagOverviewPage.getSwagNames();
        await expect(names).toEqual(PRICE_HIGH_TO_LOW_ORDER);

        const prices = await SwagOverviewPage.getSwagPrices();
        for (let i = 1; i < prices.length; i++) {
            await expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
        }

        // Equal-price tie-breaker: Sauce Labs Bolt T-Shirt ($15.99) before Test.allTheThings() ($15.99)
        const boltIndex = names.indexOf('Sauce Labs Bolt T-Shirt');
        const tattIndex = names.indexOf('Test.allTheThings() T-Shirt (Red)');
        await expect(boltIndex).toBeLessThan(tattIndex);

        // Step 2: same-price, same-name scenario — relative order not asserted until F4 is resolved.
        // The standard catalogue has no duplicate names; this sub-scenario requires additional test data.

        // Step 3: empty-catalogue variant — blocked pending F2.
        // Cannot be automated until the empty-catalogue variant and its approved result are defined.
    });

    it('[QG-57] Price (low to high) works for every permitted functional-test account', async () => {
        const accounts = [
            LOGIN_USERS.STANDARD,
            LOGIN_USERS.PROBLEM,
            LOGIN_USERS.PERFORMANCE,
            LOGIN_USERS.ERROR,
        ];

        for (const account of accounts) {
            await setTestContext({user: account, path: PAGES.SWAG_ITEMS});
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('lohi');
            await assertNoAlert(account.username);

            await expect(await SwagOverviewPage.getSelectedSortText()).toEqual(
                'Price (low to high)',
            );
            await expect(await SwagOverviewPage.getSwagNames()).toEqual(
                PRICE_LOW_TO_HIGH_ORDER,
            );
        }
    });

    it('[QG-58] Price (high to low) works for every permitted functional-test account', async () => {
        const accounts = [
            LOGIN_USERS.STANDARD,
            LOGIN_USERS.PROBLEM,
            LOGIN_USERS.PERFORMANCE,
            LOGIN_USERS.ERROR,
        ];

        for (const account of accounts) {
            await setTestContext({user: account, path: PAGES.SWAG_ITEMS});
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('hilo');
            await assertNoAlert(account.username);

            await expect(await SwagOverviewPage.getSelectedSortText()).toEqual(
                'Price (high to low)',
            );
            await expect(await SwagOverviewPage.getSwagNames()).toEqual(
                PRICE_HIGH_TO_LOW_ORDER,
            );
        }
    });

    it('[QG-59] error_user sorts Price (low to high) without an alert or error', async () => {
        await setTestContext({user: LOGIN_USERS.ERROR, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');
        await assertNoAlert('error_user');

        await expect(await SwagOverviewPage.getSelectedSortText()).toEqual('Price (low to high)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH_ORDER);
    });

    it('[QG-60] error_user sorts Price (high to low) without an alert or error', async () => {
        await setTestContext({user: LOGIN_USERS.ERROR, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');
        await assertNoAlert('error_user');

        await expect(await SwagOverviewPage.getSelectedSortText()).toEqual('Price (high to low)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_TO_LOW_ORDER);
    });
});
