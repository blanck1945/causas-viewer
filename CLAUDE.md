# causas — rules for agents working in this repo

causas is a small case-management app for lawyers. These rules keep the codebase consistent and easy to review.

1. **English in code, Spanish in the UI.** Identifiers, comments, file names, commit messages and docs are in English. User-facing text lives only in `src/i18n/es.ts` and is written in Spanish. Components never hardcode UI text: they import `es`.
2. **No console output in `src/`.** Never call `console.*`.
3. **No `any`.** Use `unknown` and narrow it. Exported functions have explicit types.
4. **Colocated tests.** Every module with logic, hook or component `foo.ts(x)` has a `foo.test.ts(x)` next to it. A new one without its test is incomplete.
5. **Layered data access.** Components never touch `localStorage` or the repository directly: they go through hooks in `src/hooks/`, and hooks go through `src/data/repository.ts`.
6. **Deadline logic lives in one place.** Any calculation involving business days, holidays or overdue checks goes in `src/domain/deadlines.ts`. Never reimplement it in a component or a hook.
7. **One component per file, function components only, files under 150 lines.**
