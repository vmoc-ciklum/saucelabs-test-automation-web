import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import { setTestContext } from '../../helpers/index';
import { LOGIN_USERS, PAGES } from '../../configs/e2eConstants';

const NAME_AZ_ORDER = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Sauce Labs Red T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
];

const PRICE_LOW_HIGH_ORDER = [
    'Sauce Labs Onesie',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Backpack',
    'Sauce Labs Fleece Jacket',
];

const PRICE_HIGH_LOW_ORDER = [
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Backpack',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Red T-Shirt',
    'Sauce Labs Bike Light',
    'Sauce Labs Onesie',
];

async function assertNoAlert(): Promise<void> {
    if (await browser.isAlertOpen()) {
        const alertText = await browser.getAlertText();
        await browser.acceptAlert();
        await expect(alertText).toBe('__no alert expected__');
    }
}

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    it('[QG-55] Reloading the catalogue resets the sort order', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');
        await assertNoAlert();

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_HIGH_ORDER);

        await browser.refresh();
        await SwagOverviewPage.waitForIsShown();

        const selectedOption = await $('[data-test="product-sort-container"]').getValue();
        await expect(selectedOption).toBe('az');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_AZ_ORDER);
    });

    it('[QG-64] Sort control offers exactly the four required options', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        const options = await $$('[data-test="product-sort-container"] option').map((o) => o.getText());

        await expect(options).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);
        await expect(options).toHaveLength(4);
    });

    it('[QG-65] sorts by Price (high to low)', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');
        await assertNoAlert();

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_LOW_ORDER);

        const names = await SwagOverviewPage.getSwagNames();
        const boltIndex = names.indexOf('Sauce Labs Bolt T-Shirt');
        const redIndex = names.indexOf('Sauce Labs Red T-Shirt');
        await expect(boltIndex).toBeLessThan(redIndex);
    });

    it('[QG-66] Returning from product details resets the sort order', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');
        await assertNoAlert();

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_LOW_ORDER);

        await SwagOverviewPage.openSwagDetails('Sauce Labs Fleece Jacket');
        await SwagDetailsPage.waitForIsShown();

        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        const selectedOption = await $('[data-test="product-sort-container"]').getValue();
        await expect(selectedOption).toBe('az');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_AZ_ORDER);
    });

    it('[QG-67] Sorting works for every permitted shopping account', async () => {
        const permittedAccounts = [
            LOGIN_USERS.STANDARD,
            LOGIN_USERS.PROBLEM,
            LOGIN_USERS.PERFORMANCE,
            LOGIN_USERS.ERROR,
        ];

        for (const account of permittedAccounts) {
            await setTestContext({ user: account, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('lohi');
            await assertNoAlert();

            await expect(await SwagOverviewPage.getSwagNames()).toEqual(
                PRICE_LOW_HIGH_ORDER,
                `Expected ascending price order for account: ${account.username}`,
            );
        }
    });
});
