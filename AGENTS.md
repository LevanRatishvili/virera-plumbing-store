# Codex Project Rules

Before making UI changes, read `DESIGN.md` and preserve the clinic design language.

## Product Boundaries

- Keep this as a clinic website with a minimal appointment request flow.
- Preserve `clinicContent` centralization in `public/app.js` for public clinic copy.
- Keep admin authentication protected.
- Do not expose appointment data publicly.
- Do not collect diagnosis, personal ID, files, medical history, prescriptions, or sensitive medical documents.
- Do not add patient accounts or a full medical CRM unless explicitly requested in a future goal.

## Engineering Rules

- Do not commit `data/store.sqlite`; it is runtime database noise.
- Do not add dependencies unless clearly necessary.
- Keep GitHub Actions and Render deploy flow intact.
- Prefer small, scoped changes that match existing patterns.

## Required Checks

Run these for UI or app changes:

- `npm run check`
- `npm run prisma:validate` when Prisma is available
- Desktop homepage verification
- Mobile `390px` homepage verification
- `/admin` unauthenticated verification
- Unauthenticated `GET /api/admin/appointments` returns `401`

For production goals, commit, push, confirm deploy success, and verify the visible build marker matches the latest commit.
