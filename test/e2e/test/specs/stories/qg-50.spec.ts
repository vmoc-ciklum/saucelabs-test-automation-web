import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import {setTestContext} from '../../helpers/index';
import {LOGIN_USERS, PAGES} from '../../configs/e2eConstants';

const NAME_AZ_ORDER = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Sauce Labs T-Shirt (Red)',
];

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    beforeEach(async () => {
        await setTestContext({user: LOGIN_USERS.STANDARD, path: PAGES.SWAG_ITEMS});
        await SwagOverviewPage.waitForIsShown();
    });

    it('[QG-55] catalogue resets to Name (A to Z) after reload', async () => {
        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSortSelectedText()).toEqual('Price (low to high)');

        await browser.refresh();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSortSelectedText()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_AZ_ORDER);
    });

    it('[QG-69] sort control offers exactly the four required options', async () => {
        const options = await SwagOverviewPage.getSortOptions();

        await expect(options).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);
    });

    it('[QG-70] sorts by Price (high to low) with the required tie-break', async () => {
        await SwagOverviewPage.selectSortOption('hilo');

        await expect(await SwagOverviewPage.getSortSelectedText()).toEqual('Price (high to low)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ]);
    });

    it('[QG-71] catalogue resets to Name (A to Z) after returning from product details', async () => {
        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSortSelectedText()).toEqual('Price (low to high)');

        await SwagOverviewPage.openSwagDetails('Sauce Labs Backpack');
        await SwagDetailsPage.waitForIsShown();

        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSortSelectedText()).toEqual('Name (A to Z)');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_AZ_ORDER);
    });

    it('[QG-72] sorting works for every permitted shopping account', async () => {
        const accounts = [
            LOGIN_USERS.STANDARD,
            LOGIN_USERS.PERFORMANCE,
            LOGIN_USERS.PROBLEM,
            LOGIN_USERS.ERROR,
        ];

        for (const account of accounts) {
            const label = account.username;

            await setTestContext({user: account, path: PAGES.SWAG_ITEMS});
            await SwagOverviewPage.waitForIsShown();

            // Name (A to Z)
            await SwagOverviewPage.selectSortOption('az');
            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`[${label}] alert on Name (A to Z): ${alertText}`).toEqual(`[${label}] no alert expected`);
            }
            await expect(`[${label}] Name (A to Z): ${(await SwagOverviewPage.getSwagNames()).join(' | ')}`).toEqual(
                `[${label}] Name (A to Z): ${NAME_AZ_ORDER.join(' | ')}`
            );

            // Name (Z to A)
            await SwagOverviewPage.selectSortOption('za');
            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`[${label}] alert on Name (Z to A): ${alertText}`).toEqual(`[${label}] no alert expected`);
            }
            await expect(`[${label}] Name (Z to A): ${(await SwagOverviewPage.getSwagNames()).join(' | ')}`).toEqual(
                `[${label}] Name (Z to A): Sauce Labs T-Shirt (Red) | Sauce Labs Onesie | Sauce Labs Fleece Jacket | Sauce Labs Bolt T-Shirt | Sauce Labs Bike Light | Sauce Labs Backpack`
            );

            // Price (low to high)
            await SwagOverviewPage.selectSortOption('lohi');
            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`[${label}] alert on Price (low to high): ${alertText}`).toEqual(`[${label}] no alert expected`);
            }
            await expect(`[${label}] Price (low to high): ${(await SwagOverviewPage.getSwagNames()).join(' | ')}`).toEqual(
                `[${label}] Price (low to high): Sauce Labs Onesie | Sauce Labs Bike Light | Sauce Labs Bolt T-Shirt | Sauce Labs T-Shirt (Red) | Sauce Labs Backpack | Sauce Labs Fleece Jacket`
            );

            // Price (high to low)
            await SwagOverviewPage.selectSortOption('hilo');
            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                await expect(`[${label}] alert on Price (high to low): ${alertText}`).toEqual(`[${label}] no alert expected`);
            }
            await expect(`[${label}] Price (high to low): ${(await SwagOverviewPage.getSwagNames()).join(' | ')}`).toEqual(
                `[${label}] Price (high to low): Sauce Labs Fleece Jacket | Sauce Labs Backpack | Sauce Labs Bolt T-Shirt | Sauce Labs T-Shirt (Red) | Sauce Labs Bike Light | Sauce Labs Onesie`
            );
        }
    });
});
