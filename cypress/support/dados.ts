export const api: string = Cypress.expose('apiUrl');
export type Usuario = { id: string; token: string; email: string; password: string };

export function criarUsuario(administrador = true): Cypress.Chainable<Usuario> {
  const email = `qa-${crypto.randomUUID()}@example.com`;
  return cy.env(['testPassword'], { log: false }).then(({ testPassword: password }) =>
    cy.request({ method: 'POST', url: `${api}/usuarios`, body: { nome: 'QA Portfolio', email, password, administrador: String(administrador) }, log: false })
    .then(({ body }) => {
      const id = body._id;
      return cy.request({ method: 'POST', url: `${api}/login`, body: { email, password }, log: false })
        .then(response => ({ id, token: response.body.authorization, email, password }));
    }));
}

export function novoProduto() {
  return { nome: `QA Portfolio ${crypto.randomUUID()}`, preco: 149, descricao: 'Produto fictício para automação', quantidade: 5 };
}

export function limparDados(admin: Usuario, ids: string[]) {
  ids.forEach(id => cy.request({ method: 'DELETE', url: `${api}/produtos/${id}`, headers: { Authorization: admin.token }, failOnStatusCode: false, log: false }).its('status').should('eq', 200));
  cy.request('DELETE', `${api}/usuarios/${admin.id}`).its('status').should('eq', 200);
}
