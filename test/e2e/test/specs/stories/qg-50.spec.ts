import SwagOverviewPage from '../../page-objects/SwagOverviewPage';
import SwagDetailsPage from '../../page-objects/SwagDetailsPage';
import { setTestContext } from '../../helpers/index';
import { LOGIN_USERS, PAGES } from '../../configs/e2eConstants';

const SHOPPING_USERS = [
    LOGIN_USERS.STANDARD,
    LOGIN_USERS.PROBLEM,
    LOGIN_USERS.PERFORMANCE,
    LOGIN_USERS.ERROR,
];

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
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Bike Light',
    'Sauce Labs Onesie',
];

describe('[QG-50] Shopper sorts the catalogue by price', () => {
    it('[QG-75] Sort control offers exactly the four required options', async () => {
        for (const user of SHOPPING_USERS) {
            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            const options = await SwagOverviewPage.getSortOptions();
            await expect({ account: user.username, options }).toEqual({
                account: user.username,
                options: ['Name (A to Z)', 'Name (Z to A)', 'Price (low to high)', 'Price (high to low)'],
            });
        }
    });

    it('[QG-76] sorts by Price (high to low)', async () => {
        for (const user of SHOPPING_USERS) {
            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('hilo');

            if (await browser.isAlertOpen()) {
                const alertText = await browser.getAlertText();
                await browser.acceptAlert();
                throw new Error(`[${user.username}] Unexpected alert after sorting: "${alertText}"`);
            }

            const names = await SwagOverviewPage.getSwagNames();
            await expect({ account: user.username, names }).toEqual({
                account: user.username,
                names: PRICE_HIGH_TO_LOW,
            });
        }
    });

    it('[QG-55] Catalogue resets to Name (A to Z) after page reload', async () => {
        for (const user of SHOPPING_USERS) {
            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('lohi');
            await expect({ account: user.username, names: await SwagOverviewPage.getSwagNames() }).toEqual({
                account: user.username,
                names: PRICE_LOW_TO_HIGH,
            });

            await browser.refresh();
            await SwagOverviewPage.waitForIsShown();

            const selectedOption = await SwagOverviewPage.getSelectedSortOptionText();
            await expect({ account: user.username, selectedOption }).toEqual({
                account: user.username,
                selectedOption: 'Name (A to Z)',
            });

            const names = await SwagOverviewPage.getSwagNames();
            await expect({ account: user.username, names }).toEqual({
                account: user.username,
                names: NAME_A_TO_Z,
            });
        }
    });

    it('[QG-77] Catalogue resets to Name (A to Z) after returning from product details', async () => {
        for (const user of SHOPPING_USERS) {
            await setTestContext({ user, path: PAGES.SWAG_ITEMS });
            await SwagOverviewPage.waitForIsShown();

            await SwagOverviewPage.selectSortOption('hilo');
            await expect({ account: user.username, names: await SwagOverviewPage.getSwagNames() }).toEqual({
                account: user.username,
                names: PRICE_HIGH_TO_LOW,
            });

            await SwagOverviewPage.openSwagDetails(0);
            await expect(await SwagDetailsPage.waitForIsShown()).toBeTruthy();

            await SwagDetailsPage.goBack();
            await SwagOverviewPage.waitForIsShown();

            const selectedOption = await SwagOverviewPage.getSelectedSortOptionText();
            await expect({ account: user.username, selectedOption }).toEqual({
                account: user.username,
                selectedOption: 'Name (A to Z)',
            });

            const names = await SwagOverviewPage.getSwagNames();
            await expect({ account: user.username, names }).toEqual({
                account: user.username,
                names: NAME_A_TO_Z,
            });
        }
    });
});
