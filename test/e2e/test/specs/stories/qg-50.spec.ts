import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import { setTestContext } from '../../helpers/index';
import { LOGIN_USERS, PAGES } from '../../configs/e2eConstants';

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    beforeEach(async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();
    });

    it('[QG-101] Sort control options and default selection', async () => {
        const options = await SwagOverviewPage.getSortOptions();
        await expect(options).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);
        const selected = await SwagOverviewPage.getSelectedSortOption();
        await expect(selected).toEqual('Name (A to Z)');
    });

    it('[QG-102] Sort by Price (high to low)', async () => {
        const users = [
            LOGIN_USERS.STANDARD,
            LOGIN_USERS.PROBLEM,
            LOGIN_USERS.PERFORMANCE,
            LOGIN_USERS.ERROR,
        ];
        const expectedOrder = [
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ];
        for (const user of users) {
            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();
            await SwagOverviewPage.selectSortOption('hilo');
            const alertOpen = await browser.isAlertOpen();
            if (alertOpen) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: no alert`).toEqual(`${user.username}: no alert — got: "${alertText}"`);
            }
            const names = await SwagOverviewPage.getSwagNames();
            await expect(`${user.username}: ${names.join(', ')}`).toEqual(`${user.username}: ${expectedOrder.join(', ')}`);
        }
    });

    it('[QG-103] Selected order remains applied on the catalogue page', async () => {
        const expectedOrder = [
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ];
        await SwagOverviewPage.selectSortOption('hilo');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(expectedOrder);
        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Price (high to low)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(expectedOrder);
    });

    it('[QG-104] Sort selection resets after returning from product details', async () => {
        const expectedLowToHigh = [
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
        ];
        const expectedAtoZ = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ];
        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(expectedLowToHigh);
        await SwagOverviewPage.openSwagDetails(0);
        await SwagDetailsPage.waitForIsShown();
        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();
        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(expectedAtoZ);
    });

    it('[QG-105] Sort selection resets after reloading the catalogue', async () => {
        const expectedHighToLow = [
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ];
        const expectedAtoZ = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ];
        await SwagOverviewPage.selectSortOption('hilo');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(expectedHighToLow);
        await browser.refresh();
        await SwagOverviewPage.waitForIsShown();
        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(expectedAtoZ);
    });
});
