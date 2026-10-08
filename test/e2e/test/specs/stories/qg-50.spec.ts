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

describe('QG-50 — Shopper sorts the catalogue by price', () => {
    beforeEach(async () => {
        await setTestContext({
            user: LOGIN_USERS.STANDARD,
            path: PAGES.SWAG_ITEMS,
        });
        await SwagOverviewPage.waitForIsShown();
    });

    it('[QG-156] sort control offers exactly the four required options', async () => {
        const options = await SwagOverviewPage.getSortOptions();

        await expect(options).toEqual([
            'Name (A to Z)',
            'Name (Z to A)',
            'Price (low to high)',
            'Price (high to low)',
        ]);
    });

    it('[QG-157] catalogue opens with Name (A to Z) selected', async () => {
        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('az');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z);
    });

    it('[QG-55] catalogue resets to Name (A to Z) after page reload', async () => {
        await SwagOverviewPage.selectSortOption('lohi');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
        ]);

        await browser.url(PAGES.SWAG_ITEMS);
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('az');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z);
    });

    it('[QG-158] catalogue resets to Name (A to Z) after returning from product details', async () => {
        await SwagOverviewPage.selectSortOption('hilo');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual([
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ]);

        await SwagOverviewPage.openSwagDetails('Sauce Labs Onesie');
        await SwagDetailsPage.waitForIsShown();

        await SwagDetailsPage.goBack();
        await SwagOverviewPage.waitForIsShown();

        await expect(await SwagOverviewPage.getSelectedSortOption()).toEqual('az');
        await expect(await SwagOverviewPage.getSwagNames()).toEqual(NAME_A_TO_Z);
    });
});
