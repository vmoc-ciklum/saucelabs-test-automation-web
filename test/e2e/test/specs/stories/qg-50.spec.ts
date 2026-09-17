import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import {setTestContext} from '../../helpers/index';
import {LOGIN_USERS, PAGES} from '../../configs/e2eConstants';

describe('QG-50 Shopper sorts the catalogue by price', () => {
    it('[QG-121] sort control offers exactly the required options', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSortOptions()).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);
    });

    it('[QG-122] Name (A to Z) is selected when the catalogue opens', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
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

    it('[QG-123] sorts by Price (high to low)', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ]);
    });

    it('[QG-124] sort resets after returning from product details', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
        ]);

        await SwagOverviewPage.openSwagDetails('Sauce Labs Bike Light');
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

    it('[QG-125] error_user can sort without an alert or error message', async () => {
        await setTestContext({user: LOGIN_USERS.ERROR, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');
        const alertOpen = await browser.isAlertOpen();
        if (alertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect('error_user: alert shown — ' + alertText).toEqual('error_user: no alert shown');
        }
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
        ]);
    });

    it('[QG-55] sorted order resets after page reload', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
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
