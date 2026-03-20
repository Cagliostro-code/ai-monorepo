# Repository Guidelines

## Project Structure & Module Organization

This repository is a `pnpm` workspace with two packages under `packages/`.

- `packages/client`: React 19 + Vite frontend. Main code lives in `src/`, with route files in `src/routes`, shared UI in `src/components`, API wrappers in `src/api`, and static assets in `public/` or `src/assets/`.
- `packages/server`: NestJS backend. Feature modules live in `src/card`, `src/chat`, and `src/link`; shared config, HTTP helpers, interceptors, and pipes live in `src/common`.
- `start.js`: boots the server first, then starts the client after `http://localhost:3000` responds.

Keep new code inside the owning package and colocate module-specific DTOs, styles, and helpers with that feature.

## Build, Test, and Development Commands

- `pnpm install`: install workspace dependencies.
- `pnpm dev`: start backend and frontend together through `start.js`.
- `pnpm dev:server`: run the Nest server in watch mode.
- `pnpm dev:client`: run the Vite client locally.
- `pnpm --filter client build`: create the frontend production bundle.
- `pnpm --filter server build`: compile the backend into `packages/server/dist`.
- `pnpm lint`: run Biome across the workspace.
- `pnpm lint:fix` and `pnpm format:fix`: apply automatic lint and format fixes.

## Coding Style & Naming Conventions

Prefer TypeScript and ESM throughout the repo. Biome is the workspace formatter, with tabs for indentation and double quotes by default; the server also carries a Prettier config with `tabWidth: 2`, single quotes, trailing commas, and semicolons, so avoid mixing styles inside a file. Follow existing local conventions before reformatting.

Treat the compiler, terminal, and source files as UTF-8 by default. Preserve existing Chinese text in code, comments, logs, and docs when it is the clearest wording, and do not replace Chinese with Unicode escapes or unnecessary English fallbacks unless a specific file is already using that pattern.

Use `PascalCase` for React components and Nest modules, `camelCase` for functions and variables, and kebab-free feature folders such as `src/link` or `src/components/editor`. Prefix intentionally unused variables with `_` to satisfy lint rules.

Add brief comments to new code when the behavior is not obvious, especially around business entry points, key branches, and request/data flow. Prefer concise explanatory comments over line-by-line narration.

## Testing Guidelines

There is no active automated test suite yet, and the root `pnpm test` script currently fails by design. For now, validate changes with targeted manual checks in both packages plus `pnpm lint`. When adding tests, place them beside the feature as `*.spec.ts` or `*.test.ts[x]` and add runnable package scripts in the same change.

## Commit & Pull Request Guidelines

Recent history mixes short free-form subjects (`init`, `saveApiKey`) with conventional prefixes (`chore: biome.js`) and concise Chinese summaries. Prefer one-line, imperative subjects; `type: summary` is recommended when it fits, for example `feat: add card upload validation`.

Pull requests should include a short description, affected package(s), manual verification steps, and screenshots or API examples for UI or contract changes. Link the relevant issue when one exists.
