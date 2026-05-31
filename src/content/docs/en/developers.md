---
title: Developer Docs
description: Dibao developer entry point, repository structure, and public contracts.
---

Developer documentation is maintained as public reference from `0.2.0` onward. It covers repository structure, API, database schema, recommendation algorithms, plugin system, and release process.

## Repository Structure

- `apps/web`: frontend Web App.
- `apps/server`: API, RSS fetching, background jobs, and recommendation maintenance.
- `packages/db`: database types, migrations, and shared data contracts.
- `docs`: public product, engineering, and developer references.

Local planning notes, execution logs, temporary validation evidence, and machine-specific notes do not belong in public docs.

## Public Contracts

- API routes and request/response shapes evolve through the API contract.
- Database structure evolves through schema migrations and database schema docs.
- Plugin manifest, capability, Hook, and UI slot names must stay documented.
- Recommendation docs explain product behavior and should not be inflated into claims for behavior that has not shipped.

## Compatibility

Formal release and hotfix images must use explicit version numbers. User quick-install docs may use `latest` as the entry point. Cross-version upgrades must preserve SQLite migrations, persistent data, and plugin data.
