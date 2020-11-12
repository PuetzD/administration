describe('Login / Registration: Test show operations on templates', () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => {
                return cy.loginViaApi();
            })
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/settings/login/registration/index`);
            });
    });

    it('@settings: Customer Scope', () => {
        // Request we want to wait for later
        cy.server();
        cy.route({
            url: `${Cypress.env('apiPath')}/_action/system-config/batch`,
            method: 'post'
        }).as('saveSettings');

        cy.get('.sw-system-config__card--0 .sw-card__title').contains('Customer Scope');

        cy.get('input[name="core.systemWideLoginRegistration.isCustomerBoundToSalesChannel"]').scrollIntoView();
        cy.get('input[name="core.systemWideLoginRegistration.isCustomerBoundToSalesChannel"]').should('be.visible');

        cy.get('input[name="core.systemWideLoginRegistration.isCustomerBoundToSalesChannel"]').click().should('have.value', 'on');
        cy.get('.smart-bar__content .sw-button--primary').click();

        cy.wait('@saveSettings').then((xhr) => {
            expect(xhr).to.have.property('status', 204);
        });

        cy.get('.sw-sales-channel-switch').scrollIntoView();
        cy.get('#salesChannelSelect')
            .typeSingleSelectAndCheck(
                'Storefront',
                '#salesChannelSelect'
            );

        cy.get('input[name="core.systemWideLoginRegistration.isCustomerBoundToSalesChannel"]').scrollIntoView();
        cy.get('input[name="core.systemWideLoginRegistration.isCustomerBoundToSalesChannel"]').should('have.value', 'on');
    });
});
