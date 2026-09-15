import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import {setTestContext} from '../../helpers/index';
import {LOGIN_USERS, PAGES} from '../../configs/e2eConstants';

const LOHI_ORDER = [
    'Sauce Labs Onesie',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Backpack',
    'Sauce Labs Fleece Jacket',
];

const HILO_ORDER = [
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Backpack',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Bike Light',
    'Sauce Labs Onesie',
];

const AZ_ORDER = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
];

// Accounts permitted by QG-46 to sign in and shop, excluding visual_user per QG-47
const SHOPPING_USERS = [
    LOGIN_USERS.STANDARD,
    LOGIN_USERS.PROBLEM,
    LOGIN_USERS.PERFORMANCE,
    LOGIN_USERS.ERROR,
];

async function assertNoAlert(context: string) {
    if (await browser.isAlertOpen()) {
        const alertText = await browser.getAlertText();
        await browser.acceptAlert();
        await expect(alertText).toEqual(`no alert expected for ${context}`);
    }
}

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    it('[QG-79] Sort control offers exactly the four required options', async () => {
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
    });

    it('[QG-80] Sort by Price (high to low)', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');

        if (await browser.isAlertOpen()) {
            const alertText = await browser.getAlertText();
            await browser.acceptAlert();
            await expect(alertText).toEqual('');
        }

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(HILO_ORDER);
    });

    it('[QG-55] Catalogue sorting resets after reload', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(LOHI_ORDER);

        await browser.refresh();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortText()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(AZ_ORDER);
    });

    it('[QG-82] Catalogue sorting resets after returning from product details', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');

        await expect(await SwagOverviewPage.getSwagNames()).toEqual(LOHI_ORDER);

        await SwagOverviewPage.openSwagDetails(LOHI_ORDER[0]);
        await SwagDetailsPage.waitForIsShown();
        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortText()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(AZ_ORDER);
    });

    it('[QG-81] Sorting works for all permitted shopping accounts', async () => {
        for (const user of SHOPPING_USERS) {
            await setTestContext({
                user,
                path: PAGES.SWAG_ITEMS,
            });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('lohi');

            await assertNoAlert(`${user.username} lohi`);

            const lohiNames = await SwagOverviewPage.getSwagNames();
            try {
                expect(lohiNames).toEqual(LOHI_ORDER);
            } catch (e) {
                throw new Error(`[${user.username}] lohi sort: ${(e as Error).message}`);
            }

            await SwagOverviewPage.selectSortOption('hilo');

            await assertNoAlert(`${user.username} hilo`);

            const hiloNames = await SwagOverviewPage.getSwagNames();
            try {
                expect(hiloNames).toEqual(HILO_ORDER);
            } catch (e) {
                throw new Error(`[${user.username}] hilo sort: ${(e as Error).message}`);
            }
        }
    });
});
