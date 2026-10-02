import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import {setTestContext} from '../../helpers/index';
import {LOGIN_USERS, PAGES} from '../../configs/e2eConstants';

const AZ_NAMES = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
];

const LOW_TO_HIGH_NAMES = [
    'Sauce Labs Onesie',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Backpack',
    'Sauce Labs Fleece Jacket',
];

const HIGH_TO_LOW_NAMES = [
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Backpack',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Bike Light',
    'Sauce Labs Onesie',
];

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    it('[QG-148] catalogue opens with Name (A to Z) selected', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOptionText()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(AZ_NAMES);
    });

    it('[QG-149] sorts by Price (high to low)', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');

        const isAlertOpen = await browser.isAlertOpen();
        if (isAlertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`unexpected alert: ${alertText}`).toEqual('no alert');
        }

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(HIGH_TO_LOW_NAMES);
    });

    it('[QG-55] sort order resets after page reload', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        const isAlertOpen = await browser.isAlertOpen();
        if (isAlertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`unexpected alert: ${alertText}`).toEqual('no alert');
        }

        await expect(await SwagOverviewPage.getSelectedSortOptionText()).toEqual('Price (low to high)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(LOW_TO_HIGH_NAMES);

        await browser.refresh();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOptionText()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(AZ_NAMES);
    });

    it('[QG-150] sort order resets after returning from product details', async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');

        const isAlertOpen = await browser.isAlertOpen();
        if (isAlertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`unexpected alert: ${alertText}`).toEqual('no alert');
        }

        await expect(await SwagOverviewPage.getSelectedSortOptionText()).toEqual('Price (high to low)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(HIGH_TO_LOW_NAMES);

        await SwagOverviewPage.openSwagDetails('Sauce Labs Fleece Jacket');
        await expect(await SwagDetailsPage.waitForIsShown()).toBeTruthy();

        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOptionText()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(AZ_NAMES);
    });

    it('[QG-151] problem_user can sort by price', async () => {
        await setTestContext({user: LOGIN_USERS.PROBLEM, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        const isAlertOpen = await browser.isAlertOpen();
        if (isAlertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${LOGIN_USERS.PROBLEM.username}: unexpected alert: ${alertText}`).toEqual(`${LOGIN_USERS.PROBLEM.username}: no alert`);
        }

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(LOW_TO_HIGH_NAMES);
    });

    it('[QG-152] error_user can sort by price', async () => {
        await setTestContext({user: LOGIN_USERS.ERROR, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');

        const isAlertOpen = await browser.isAlertOpen();
        if (isAlertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${LOGIN_USERS.ERROR.username}: unexpected alert: ${alertText}`).toEqual(`${LOGIN_USERS.ERROR.username}: no alert`);
        }

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(HIGH_TO_LOW_NAMES);
    });

    it('[QG-153] error_user changes sort without an alert or error message', async () => {
        await setTestContext({user: LOGIN_USERS.ERROR, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        const isAlertOpen = await browser.isAlertOpen();
        if (isAlertOpen) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(`${LOGIN_USERS.ERROR.username}: unexpected alert: ${alertText}`).toEqual(`${LOGIN_USERS.ERROR.username}: no alert`);
        }

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(LOW_TO_HIGH_NAMES);
    });
});
