import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import {setTestContext} from '../../helpers/index';
import {LOGIN_USERS, PAGES} from '../../configs/e2eConstants';

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    it('[QG-95] sort control offers exactly the four specified options in order', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        const options = await SwagOverviewPage.getSortOptions();

        await expect(options).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);
    });

    it('[QG-96] sorts by Price (high to low)', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');

        if (await browser.isAlertOpen()) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect('no alert expected').toEqual(`alert shown: "${alertText}"`);
        }

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Price (high to low)');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ]);
    });

    it('[QG-97] changing the sort order shows no alert or error for error_user', async () => {
        await setTestContext({ user: LOGIN_USERS.ERROR, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        if (await browser.isAlertOpen()) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect('no alert expected').toEqual(`alert shown: "${alertText}"`);
        }

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Price (low to high)');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
        ]);
    });

    it('[QG-55] selected order resets after returning from product details', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        if (await browser.isAlertOpen()) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect('no alert expected').toEqual(`alert shown: "${alertText}"`);
        }

        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
        ]);

        await SwagOverviewPage.openSwagDetails('Sauce Labs Backpack');
        await SwagDetailsPage.waitForIsShown();
        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ]);
    });

    it('[QG-98] selected order resets after reloading the catalogue', async () => {
        await setTestContext({ user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');

        if (await browser.isAlertOpen()) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect('no alert expected').toEqual(`alert shown: "${alertText}"`);
        }

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Price (high to low)');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ]);

        await browser.refresh();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ]);
    });
});
