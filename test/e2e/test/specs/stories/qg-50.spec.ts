import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import {setTestContext} from '../../helpers/index';
import {LOGIN_USERS, PAGES} from '../../configs/e2eConstants';

// QG-50 — Shopper sorts the catalogue by price

const SHOPPING_USERS = [
    LOGIN_USERS.STANDARD,
    LOGIN_USERS.PROBLEM,
    LOGIN_USERS.PERFORMANCE,
    LOGIN_USERS.ERROR,
];

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    it('[QG-114] Sort control offers exactly the required options', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSortOptions()).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);
    });

    it('[QG-115] Catalogue opens with Name (A to Z) selected', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortLabel()).toEqual('Name (A to Z)');
    });

    it('[QG-55] Reload resets the catalogue sort', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSelectedSortLabel()).toEqual('Price (low to high)');

        await browser.url(PAGES.SWAG_ITEMS);
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortLabel()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ]);
    });

    it('[QG-118] Back to products resets the catalogue sort', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSelectedSortLabel()).toEqual('Price (low to high)');

        await SwagOverviewPage.openSwagDetails('Sauce Labs Onesie');
        await SwagDetailsPage.waitForIsShown();

        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortLabel()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ]);
    });

    for (const user of SHOPPING_USERS) {
        it(`[QG-116] Sort by Price (high to low) — ${user.username}`, async () => {
            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('hilo');

            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: alert — ${alertText}`).toEqual(`${user.username}: no alert`);
            }

            await expect(`${user.username}: ${(await SwagOverviewPage.getSwagNames()).join('|')}`).toEqual(
                `${user.username}: Sauce Labs Fleece Jacket|Sauce Labs Backpack|Sauce Labs Bolt T-Shirt|Test.allTheThings() T-Shirt (Red)|Sauce Labs Bike Light|Sauce Labs Onesie`
            );
            await expect(`${user.username}: ${(await SwagOverviewPage.getSwagPrices()).join('|')}`).toEqual(
                `${user.username}: $49.99|$29.99|$15.99|$15.99|$9.99|$7.99`
            );
        });
    }

    for (const user of SHOPPING_USERS) {
        it(`[QG-117] Changing the sort order shows no alert or error — ${user.username}`, async () => {
            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('lohi');

            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: alert on lohi — ${alertText}`).toEqual(`${user.username}: no alert`);
            }

            await expect(`${user.username}: sort after lohi — ${await SwagOverviewPage.getSelectedSortLabel()}`).toEqual(
                `${user.username}: sort after lohi — Price (low to high)`
            );

            await SwagOverviewPage.selectSortOption('hilo');

            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: alert on hilo — ${alertText}`).toEqual(`${user.username}: no alert`);
            }

            await expect(`${user.username}: sort after hilo — ${await SwagOverviewPage.getSelectedSortLabel()}`).toEqual(
                `${user.username}: sort after hilo — Price (high to low)`
            );
        });
    }
});
