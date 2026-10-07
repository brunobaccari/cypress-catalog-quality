
afterEach(() => {
  if (Cypress.spec.relative.replaceAll('\\', '/').includes('/frontend/')) {
    cy.get('body').should('be.visible');
    cy.screenshot({ capture: 'viewport', blackout: ['input[type="password"]'] });
  }
});
