import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import { setTestContext } from '../../helpers/index';
import { LOGIN_USERS, PAGES } from '../../configs/e2eConstants';

const PRICE_LOW_TO_HIGH = [
    'Sauce Labs Onesie',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Backpack',
    'Sauce Labs Fleece Jacket',
];

const PRICE_HIGH_TO_LOW = [
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Backpack',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Bike Light',
    'Sauce Labs Onesie',
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
    it('[QG-142] Sort control offers exactly the four required options', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        const options = await SwagOverviewPage.getSortOptions();

        await expect(options).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);

        await expect(options.length).toEqual(4);
    });

    it('[QG-143] Catalogue opens with Name (A to Z) selected', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
    });

    it('[QG-55] Sorted order resets after page reload', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        const alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`alert: ${alertText}`).toEqual('no alert');
        }

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);

        await browser.refresh();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z);
    });

    it('[QG-145] Returning from product details resets the sort', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        const alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`alert: ${alertText}`).toEqual('no alert');
        }

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);

        await SwagOverviewPage.openSwagDetails('Sauce Labs Onesie');
        await SwagDetailsPage.waitForIsShown();

        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z);
    });

    it('[QG-144] Sorting works for every permitted non-visual account', async () => {
        const accounts = [
            LOGIN_USERS.PROBLEM,
            LOGIN_USERS.PERFORMANCE,
            LOGIN_USERS.ERROR,
        ];

        for (const user of accounts) {
            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('lohi');

            const alertOpenLohi = await browser.isAlertOpen();
            if (alertOpenLohi) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: alert on lohi sort: ${alertText}`).toEqual(`${user.username}: no alert`);
            }

            await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);

            await SwagOverviewPage.selectSortOption('hilo');

            const alertOpenHilo = await browser.isAlertOpen();
            if (alertOpenHilo) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: alert on hilo sort: ${alertText}`).toEqual(`${user.username}: no alert`);
            }

            await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_TO_LOW);
        }
    });
});
