import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import {setTestContext} from '../../helpers/index';
import {LOGIN_USERS, PAGES} from '../../configs/e2eConstants';

const NAME_A_TO_Z = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
];

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

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    describe('standard_user', () => {
        beforeEach(async () => {
            await setTestContext({
                user: LOGIN_USERS.STANDARD,
                path: PAGES.SWAG_ITEMS,
            });
            await SwagOverviewPage.waitForIsShown();
        });

        it('[QG-128] sort control offers exactly the required options', async () => {
            const options = await SwagOverviewPage.getSortOptions();
            await expect(options).toEqual([
                'Name (A to Z)',
                'Name (Z to A)',
                'Price (low to high)',
                'Price (high to low)',
            ]);
        });

        it('[QG-129] catalogue opens with Name (A to Z) selected', async () => {
            await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
            await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z);
        });

        it('[QG-130] sorts by Price (high to low)', async () => {
            await SwagOverviewPage.selectSortOption('hilo');
            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${LOGIN_USERS.STANDARD.username}: no alert`).toEqual(`no alert but got: ${alertText}`);
            }
            await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_TO_LOW);
        });

        it('[QG-131] sort resets after returning from product details', async () => {
            await SwagOverviewPage.selectSortOption('hilo');
            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${LOGIN_USERS.STANDARD.username}: no alert`).toEqual(`no alert but got: ${alertText}`);
            }
            await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_TO_LOW);
            await SwagOverviewPage.openSwagDetails(0);
            await SwagDetailsPage.waitForIsShown();
            await SwagDetailsPage.goBack();
            await SwagOverviewPage.waitForIsShown();
            await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
            await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z);
        });

        it('[QG-55] sorted order resets after page reload', async () => {
            await SwagOverviewPage.selectSortOption('lohi');
            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${LOGIN_USERS.STANDARD.username}: no alert`).toEqual(`no alert but got: ${alertText}`);
            }
            await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_TO_HIGH);
            await browser.refresh();
            await SwagOverviewPage.waitForIsShown();
            await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
            await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z);
        });
    });

    describe('error_user', () => {
        beforeEach(async () => {
            await setTestContext({
                user: LOGIN_USERS.ERROR,
                path: PAGES.SWAG_ITEMS,
            });
            await SwagOverviewPage.waitForIsShown();
        });

        it('[QG-132] sorting shows no alert', async () => {
            await SwagOverviewPage.selectSortOption('lohi');
            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${LOGIN_USERS.ERROR.username}: no alert`).toEqual(`no alert but got: ${alertText}`);
            }
        });

        it('[QG-133] sorting shows no error message', async () => {
            await SwagOverviewPage.selectSortOption('lohi');
            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
            }
            await expect(await $('*=Sorting is broken!').isExisting()).toEqual(false);
            await expect(await $('*=Sorting is broken! This error has been reported to Backtrace.').isExisting()).toEqual(false);
        });
    });
});
