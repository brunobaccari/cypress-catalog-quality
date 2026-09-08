# ServeRest — Cypress and TypeScript

[Versão em português](README.md)

Tests against the hosted [frontend](https://front.serverest.dev) and [API](https://serverest.dev). This continues my [Cypress/ServeRest project](https://github.com/brunobaccari/cypress-serverest), keeping frontend and API specs separate.

## Run

Node.js 22.9 or later, npm and Google Chrome. CI uses Node 24.

```bash
cp .env.example .env
npm ci
npm run typecheck
npm test
```

On PowerShell, use `Copy-Item .env.example .env`. No local application is required. Runtime URLs and the temporary account password are configured in `.env`; existing process variables take precedence. The file is ignored by Git.

## Scenarios and data

Eight cases cover product creation, lookup and deletion; duplicate names without modifying the original; negative, fractional and nonnumeric prices; unauthorized creation; creation through the UI checked against the API; and UI deletion of an API-created product.

Each spec creates its own temporary administrator. Products include a UUID in their names, and cleanup uses only IDs created by the suite. `cypress/support/dados.ts` owns setup and cleanup. Other users' records are not removed.

`cy.intercept` observes real requests so tests can wait for completion; it does not return mocked responses. No fixed sleeps or automatic test retries. Do not run load tests against the public service.

## Evidence and limits

JUnit reports go to `results/`; failure screenshots go to `cypress/screenshots/`. GitHub Actions uploads artifacts. See [Actions runs and artifacts](https://github.com/brunobaccari/cypress-catalog-quality/actions).

This is a shared public environment. Resets and changes by others can affect a run; failures remain visible. The example account password is for synthetic test accounts only. If adapting the suite, inject private credentials through CI secrets and review the target's contract.

References: [ServeRest API documentation](https://serverest.dev/) and [official repository](https://github.com/ServeRest/ServeRest).

Commit dates in this portfolio were reorganized retroactively; Actions runs retain their actual execution dates.
