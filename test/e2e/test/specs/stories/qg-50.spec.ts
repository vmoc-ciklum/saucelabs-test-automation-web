import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import {setTestContext} from '../../helpers/index';
import {LOGIN_USERS, PAGES} from '../../configs/e2eConstants';

// Accounts permitted to sign in and shop (QG-46), excluding visual_user (QG-47).
const SHOPPING_USERS = [
    LOGIN_USERS.STANDARD,
    LOGIN_USERS.PROBLEM,
    LOGIN_USERS.PERFORMANCE,
    LOGIN_USERS.ERROR,
];

const NAME_AZ = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)',
];

const PRICE_LOW_HIGH = [
    'Sauce Labs Onesie',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Backpack',
    'Sauce Labs Fleece Jacket',
];

const PRICE_HIGH_LOW = [
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Backpack',
    'Sauce Labs Bolt T-Shirt',
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Bike Light',
    'Sauce Labs Onesie',
];

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    it('[QG-166] Sort control offers exactly the required options', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSortOptions()).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);
    });

    it('[QG-167] Catalogue opens with Name (A to Z) selected', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
    });

    for (const user of SHOPPING_USERS) {
        it(`[QG-168] sorts by Price (high to low) — ${user.username}`, async () => {
            await setTestContext({
                user,
                path: PAGES.SWAG_ITEMS,
            });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('hilo');

            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`${user.username}: unexpected alert — ${alertText}`).toEqual(`${user.username}: no alert`);
            }

            await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_LOW);
        });
    }

    it('[QG-55] Catalogue resets to Name (A to Z) after page reload', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_LOW_HIGH);

        await browser.refresh();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_AZ);
    });

    it('[QG-169] Catalogue resets to Name (A to Z) after returning from product details', async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();

        await SwagOverviewPage.selectSortOption('hilo');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(PRICE_HIGH_LOW);

        await SwagOverviewPage.openSwagDetails('Sauce Labs Fleece Jacket');
        await SwagDetailsPage.waitForIsShown();

        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_AZ);
    });

    for (const user of SHOPPING_USERS) {
        it(`[QG-170] Changing the sort order shows no alert or error — ${user.username}`, async () => {
            await setTestContext({
                user,
                path: PAGES.SWAG_ITEMS,
            });
            await SwagOverviewPage.waitForIsShown();

            const steps: Array<{ option: 'za' | 'lohi' | 'hilo' | 'az'; label: string }> = [
                { option: 'za', label: 'Name (Z to A)' },
                { option: 'lohi', label: 'Price (low to high)' },
                { option: 'hilo', label: 'Price (high to low)' },
                { option: 'az', label: 'Name (A to Z)' },
            ];

            for (const step of steps) {
                await SwagOverviewPage.selectSortOption(step.option);
                if (await browser.isAlertOpen()) {
                    const alertText = await browser.getAlertText();
                    await browser.acceptAlert();
                    await expect(`${user.username}: alert on ${step.label} — ${alertText}`).toEqual(`${user.username}: no alert on ${step.label}`);
                }
            }
        });
    }
});
