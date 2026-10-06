import { api, Usuario, criarUsuario, novoProduto, limparDados } from '../../support/dados';

describe('Produtos — API hospedada do ServeRest', () => {
  let admin: Usuario;
  let usuario: Usuario;
  const ids: string[] = [];
  before(() => criarUsuario().then(value => { admin = value; }));
  before(() => criarUsuario(false).then(value => { usuario = value; }));
  after(() => {
    if (admin) limparDados(admin, ids);
    if (usuario) limparDados(usuario, []);
  });

  it('cria, consulta e exclui apenas o produto do cenário', () => {
    const produto = novoProduto();
    cy.request({ method: 'POST', url: `${api}/produtos`, headers: { Authorization: admin.token }, body: produto }).then(({ status, body }) => {
      ids.push(body._id);
      expect(status).to.eq(201);
      cy.request(`${api}/produtos/${body._id}`).its('body').should('deep.eq', { ...produto, _id: body._id });
      cy.request({ method: 'DELETE', url: `${api}/produtos/${body._id}`, headers: { Authorization: admin.token } }).its('status').should('eq', 200);
      cy.request({ url: `${api}/produtos/${body._id}`, failOnStatusCode: false }).its('status').should('eq', 400);
    });
  });

  it('rejeita nome duplicado sem alterar o produto existente', () => {
    const produto = novoProduto();
    cy.request({ method: 'POST', url: `${api}/produtos`, headers: { Authorization: admin.token }, body: produto }).then(({ body }) => {
      ids.push(body._id);
      cy.request({ method: 'POST', url: `${api}/produtos`, headers: { Authorization: admin.token }, body: produto, failOnStatusCode: false }).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Já existe produto com esse nome');
      });
      cy.request(`${api}/produtos/${body._id}`).its('body.preco').should('eq', produto.preco);
    });
  });

  for (const preco of [-1, 1.5, 'abc']) {
    it(`rejeita preço inválido: ${preco}`, () => {
      cy.request({ method: 'POST', url: `${api}/produtos`, headers: { Authorization: admin.token }, body: { ...novoProduto(), preco }, failOnStatusCode: false }).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('preco');
      });
    });
  }

  it('não permite criar produto sem autenticação', () => {
    cy.request({ method: 'POST', url: `${api}/produtos`, body: novoProduto(), failOnStatusCode: false }).its('status').should('eq', 401);
  });

  for (const method of ['PUT', 'DELETE']) {
    it(`bloqueia ${method} de usuário comum sem alterar o produto`, () => {
      const produto = novoProduto();
      cy.request({ method: 'POST', url: `${api}/produtos`, headers: { Authorization: admin.token }, body: produto }).then(({ body }) => {
        ids.push(body._id);
        cy.request({
          method, url: `${api}/produtos/${body._id}`,
          headers: { Authorization: usuario.token },
          ...(method === 'PUT' ? { body: { ...produto, preco: 1 } } : {}),
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(403);
          expect(response.body.message).to.eq('Rota exclusiva para administradores');
        });
        cy.request(`${api}/produtos/${body._id}`).its('body').should('deep.eq', { ...produto, _id: body._id });
      });
    });
  }
});
