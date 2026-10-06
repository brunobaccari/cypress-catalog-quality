# ServeRest — Cypress e TypeScript

[English version](README.en.md)

Testes contra **https://front.serverest.dev** e **https://serverest.dev**. Continuação do meu [Cypress/ServeRest](https://github.com/brunobaccari/cypress-serverest), mantendo `frontend` e `api` separados.

## Instalação e execução

Node.js 22.9 ou superior, npm e Google Chrome. O CI usa Node 24.

```bash
cp .env.example .env
npm ci
npm run typecheck
npm test
```

Não há aplicação local para iniciar.

## Cenários

- Criar, consultar e excluir um produto pela API.
- Rejeitar nome duplicado e conferir que o produto original não mudou.
- Rejeitar preços negativos, fracionados e texto inválido.
- Bloquear criação sem autenticação.
- Criar produto pelo formulário e conferir todos os campos pela API.
- Excluir na interface um produto preparado pela API e confirmar a ausência.

## Dados e organização

Cada spec cria seu administrador temporário. Os produtos têm UUID no nome; a limpeza usa somente os IDs criados pela suíte. `cypress/support/dados.ts` concentra essa preparação e limpeza. Não são usados usuários fixos de outras pessoas nem excluídos registros alheios.

`cy.intercept` observa a requisição real para aguardar sua conclusão; não devolve respostas falsas. Sem espera fixa de cinco segundos e sem retry automático. Não execute testes de carga neste ambiente público.

## Relatórios

JUnit por spec em `results/`, screenshots de falha em `cypress/screenshots/` e artifacts no GitHub Actions. [Execuções e artifacts no Actions](https://github.com/brunobaccari/cypress-catalog-quality/actions).

O ambiente é compartilhado e pode reiniciar ou ter dados alterados por terceiros. Falhas externas permanecem visíveis. As regras de resposta vêm da [documentação do ServeRest](https://serverest.dev/) e o uso do ambiente público é descrito no [repositório oficial](https://github.com/ServeRest/ServeRest).

## Configuração do ambiente

Copie `.env.example` para `.env` (`Copy-Item .env.example .env` no PowerShell ou `cp .env.example .env` no Linux/macOS). As variáveis do processo têm prioridade. `.env` não é versionado. URLs e credenciais ficam nessa configuração; os valores esperados dos testes permanecem nos cenários.

As contas do exemplo são públicas e exclusivas de demonstração. Para outro ambiente, injete credenciais via secrets do CI e confirme também o contrato e os dados esperados antes de executar.


Para consultar no GitHub, abra **Actions → Tests → execução → Summary**. O resumo mostra o resultado da etapa, as contagens do JUnit e o link para baixar as evidências. Em **Artifacts**, baixe `test-results` e extraia o ZIP para abrir os relatórios. O ZIP inclui também `summary.md`. A retenção é de 7 dias; o upload e o resumo também são executados após falhas. Se não houver relatório, o resumo informa que não foi possível confirmar a execução.

## Riscos e decisão no CI

Autenticação não substitui autorização: um usuário comum tenta editar e excluir um produto criado pelo administrador. A suíte exige 403 e consulta novamente todos os campos para conferir que a tentativa não mudou o estado. Os registros usam IDs próprios e são removidos no teardown.

O gate exige testes aprovados e JUnit legível, sem falhas, cenários ignorados ou relatório vazio. Uma execução sem relatório não aprova o commit. Em uma falha, confira primeiro instalação/rede, depois o estado capturado nos artifacts e a expectativa do cenário; mudar a expectativa exige confirmar a regra do ambiente. Sem retry automático para transformar uma falha em aprovação.

Datas de commits deste portfólio foram reorganizadas retroativamente; as execuções do Actions mantêm suas datas reais.
