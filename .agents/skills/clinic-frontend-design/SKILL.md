---
name: clinic-frontend-design
description: Project-specific guidance for polishing the Georgian medical clinic frontend without changing product scope.
---

# Clinic Frontend Design

Use this skill when changing the public clinic UI, Georgian healthcare copy, appointment form, or responsive layout.

## Read First

- Read `DESIGN.md`.
- Read `AGENTS.md`.
- Inspect `clinicContent` in `public/app.js` before editing public content.

## UI Principles

- Keep the site light, calm, medical, and trustworthy.
- Use existing blue/teal tokens and white surfaces.
- Prefer small spacing, alignment, contrast, and responsiveness fixes over redesigns.
- Avoid generic AI decoration, dark dashboard styling, ecommerce patterns, and fake medical claims.

## Georgian Copy

- Keep Georgian text concise and practical.
- Mark demo data clearly where doctors, prices, or clinic details are placeholders.
- Do not invent licenses, certifications, awards, or outcomes.

## Safety

- Appointment form stays minimal.
- Do not add diagnosis, personal ID, file upload, medical history, prescriptions, or sensitive document fields.
- Keep admin protected and never expose appointment data on public pages.

## QA

- Run `npm run check`.
- Run `npm run prisma:validate` if available.
- Verify desktop and 390px mobile homepage.
- Verify `/admin` unauthenticated state.
- Verify unauthenticated `/api/admin/appointments` returns `401`.
