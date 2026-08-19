import { api, Admin, criarAdministrador, novoProduto, limparDados } from '../../support/dados';

describe('Produtos — frontend hospedado do ServeRest', () => {
  let admin: Admin;
  const ids: string[] = [];
  before(() => criarAdministrador().then(value => { admin = value; }));
  after(() => { if (admin) limparDados(admin, ids); });
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name=email]').type(admin.email);
    cy.get('input[name=password]').type(admin.password, { log: false });
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/admin/home');
  });

  it('cadastra pelo formulário e confere o produto na API', () => {
    const produto = novoProduto();
    cy.intercept('POST', `${api}/produtos`).as('cadastro');
    cy.visit('/admin/cadastrarprodutos');
    cy.get('[data-testid=nome]').type(produto.nome);
    cy.get('[data-testid=preco]').type(String(produto.preco));
    cy.get('[data-testid=descricao]').type(produto.descricao);
    cy.get('[data-testid=quantity]').type(String(produto.quantidade));
    cy.get('button[type=submit]').click();
    cy.wait('@cadastro').then(({ response }) => {
      if (response?.body._id) ids.push(response.body._id);
      expect(response?.statusCode).to.eq(201);
      cy.request(`${api}/produtos/${response!.body._id}`).its('body').should('deep.eq', { ...produto, _id: response!.body._id });
    });
    cy.contains('td', produto.nome).should('be.visible');
  });

  it('exclui pela interface um produto preparado pela API', () => {
    const produto = novoProduto();
    cy.request({ method:'POST', url:`${api}/produtos`, headers:{ Authorization:admin.token }, body:produto }).then(({body}) => {
      ids.push(body._id);
      cy.intercept('DELETE', `${api}/produtos/${body._id}`).as('exclusao');
      cy.visit('/admin/listarprodutos');
      cy.contains('td', produto.nome).parent('tr').contains('button', 'Excluir').click();
      cy.wait('@exclusao').its('response.statusCode').should('eq', 200);
      cy.contains('td', produto.nome).should('not.exist');
      cy.request({ url:`${api}/produtos/${body._id}`, failOnStatusCode:false }).its('status').should('eq', 400);
    });
  });
});
