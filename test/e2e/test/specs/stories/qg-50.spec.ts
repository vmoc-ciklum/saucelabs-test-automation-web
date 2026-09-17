import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
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

const NAME_A_TO_Z_ORDER = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
];

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    it('[QG-55] Sorted order resets after page reload', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSortControlSelected()).toEqual('Price (low to high)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH_ORDER);

        await browser.refresh();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSortControlSelected()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z_ORDER);
    });

    it('[QG-107] Sort control offers exactly the four required options', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSortControlOptions()).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);
    });

    it('[QG-108] Catalogue opens with Name (A to Z) selected', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSortControlSelected()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z_ORDER);
    });

    it('[QG-109] Sort by Price (high to low)', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');

        await expect(await SwagOverviewPage.getSortControlSelected()).toEqual('Price (high to low)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ]);
    });

    it('[QG-110] Sorting resets after returning from product details', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');
        await expect(await SwagOverviewPage.getSortControlSelected()).toEqual('Price (high to low)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ]);

        await SwagOverviewPage.openSwagDetails('Sauce Labs Fleece Jacket');
        await SwagDetailsPage.waitForIsShown();

        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSortControlSelected()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z_ORDER);
    });

    const shoppingAccounts = [
        LOGIN_USERS.STANDARD,
        LOGIN_USERS.PROBLEM,
        LOGIN_USERS.PERFORMANCE,
        LOGIN_USERS.ERROR,
    ];

    for (const user of shoppingAccounts) {
        it(`[QG-111] Sorting works for every permitted shopping account — ${user.username}`, async () => {
            await setTestContext({user, path: PAGES.SWAG_ITEMS});
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('lohi');

            const alertOpen = await browser.isAlertOpen();
            if (alertOpen) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: alert shown: ${alertText}`).toEqual(`${user.username}: no alert`);
            }

            await expect(await SwagOverviewPage.getSortControlSelected()).toEqual('Price (low to high)');
            await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH_ORDER);
        });
    }

    it('[QG-112] Sorting works for error_user without an alert or error message', async () => {
        await setTestContext({user: LOGIN_USERS.ERROR, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        const alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect('error_user: alert shown: ' + alertText).toEqual('error_user: no alert');
        }

        await expect(await SwagOverviewPage.getSortControlSelected()).toEqual('Price (low to high)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH_ORDER);
    });
});
