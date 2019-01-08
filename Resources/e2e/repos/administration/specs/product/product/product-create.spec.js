const productPage = require('administration/page-objects/sw-product.page-object.js');

module.exports = {
    '@tags': ['product-create', 'product', 'create', 'upload'],
    before: (browser, done) => {
        global.FixtureService.create('category').then(() => {
            done();
        });
    },
    'open product listing': (browser) => {
        browser
            .assert.containsText('.sw-admin-menu__navigation-list-item.sw-product span.collapsible-text', 'Products')
            .click('a.sw-admin-menu__navigation-link[href="#/sw/product/index"]')
            .waitForElementVisible('.smart-bar__actions a')
            .waitForElementVisible('.sw-page__smart-bar-amount')
            .assert.containsText('.sw-page__smart-bar-amount', '(0)');
    },
    'go to create page, fill and save the new product': (browser) => {
        const page = productPage(browser);

        browser
            .click('a[href="#/sw/product/create"]')
            .waitForElementVisible('.sw-product-detail-base')
            .assert.urlContains('#/sw/product/create')
            .assert.containsText('.sw-card__title', 'Information');

        page.createBasicProduct('Marci Darci');

        browser
            .fillSwSelectComponent(
                '.sw-product-detail__select-category',
                {
                    value: global.FixtureService.basicFixture.name,
                    isMulti: true,
                    searchTerm: global.FixtureService.basicFixture.name
                }
            )
            .click('.sw-product-detail__save-action')
            .checkNotification('Product "Marci Darci" has been saved successfully')
            .assert.urlContains('#/sw/product/detail');
    },
    'upload product image ': (browser) => {
        const page = productPage(browser);
        page.addProductImageViaUrl(`${process.env.APP_URL}/bundles/administration/static/fixtures/sw-login-background.png`, 'Marci Darci');
        browser
            .getAttribute('.sw-media-preview__item', 'src', function (result) {
                this.assert.ok(result.value);
                this.assert.notEqual(result.value, `${process.env.APP_URL}/bundles/administration/static/fixtures/sw-login-background.png`);
            });
    },
    'go back to listing, search and verify creation': (browser) => {
        browser
            .click('a.smart-bar__back-btn')
            .refresh()
            .waitForElementVisible('.sw-product-list__content')
            .fillGlobalSearchField('Marci Darci')
            .waitForElementVisible('.sw-page__smart-bar-amount')
            .assert.containsText('.sw-page__smart-bar-amount', '(1)');
    },
    'check if the data of the product is assigned correctly': (browser) => {
        browser
            .refresh()
            .waitForElementVisible('.sw-product-list__column-product-name')
            .assert.containsText('.sw-product-list__column-product-name', 'Marci Darci')
            .waitForElementPresent('.sw-product-list__column-manufacturer-name')
            .assert.containsText('.sw-product-list__column-manufacturer-name', 'shopware AG')
            .clickContextMenuItem('.sw_product_list__edit-action', '.sw-context-button__button', '.sw-grid-row:first-child')
            .waitForElementVisible('.sw-product-detail-base')
            .waitForElementVisible('.sw-media-preview__item')
            .waitForElementPresent('.sw-product-category-form .sw-select__selection-item')
            .assert.containsText('.ql-editor', 'My very first description')
            .assert.containsText('.sw-product-category-form .sw-select__selection-text', global.FixtureService.basicFixture.name)
            .click('a.smart-bar__back-btn');
    },
    after: (browser) => {
        browser.end();
    }
};
