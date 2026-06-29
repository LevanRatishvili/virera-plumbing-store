# Design Standards

This project is a premium demo website for a Georgian ambulatory medical clinic. Future UI work should preserve the calm, clean, trustworthy clinic feel and avoid generic AI-generated visuals.

## Design Language

- Use a clean medical aesthetic: spacious, orderly, practical, and reassuring.
- Keep the page mostly white or very light blue with restrained blue and teal accents.
- Prioritize trust, clarity, and calm over spectacle.
- Use rounded cards consistently. The current standard radius is `8px` for cards, fields, panels, and framed content.
- Use soft shadows sparingly. Shadows should lift cards subtly, not glow.
- Keep section spacing generous and predictable.
- Keep CTAs clear, direct, and action-oriented.
- Design mobile-first. Content must stack cleanly at narrow widths and avoid horizontal overflow.
- Preserve the small build marker; it should never compete with clinic content.

## Color

- Backgrounds: white, near-white, or very light medical blue.
- Accents: existing blue and teal tokens in `public/styles.css`.
- Text: dark blue-gray for primary copy; muted blue-gray for secondary copy.
- Avoid dark dashboard themes, purple-heavy gradients, neon effects, and high-glow surfaces.

## Typography

- Georgian text should be short, natural, and easy to scan.
- Avoid overlong Georgian button labels on compact controls.
- Keep headings confident but not promotional.
- Do not use negative letter spacing.
- Do not scale type with viewport width beyond the existing `clamp()` heading pattern.
- Preserve readable line-height for Georgian copy.

## Buttons

- Primary buttons use the existing blue-to-teal treatment.
- Secondary buttons should be white with a calm border and teal text.
- Buttons must have visible focus states.
- Button text should fit on mobile without clipping or awkward wrapping.
- Use one clear primary CTA per section where possible.

## Cards

- Cards should be flat, tidy, and consistent in height when repeated in a grid.
- Use cards for repeated services, doctors, form panels, map placeholders, and admin rows.
- Do not nest decorative cards inside other cards.
- Avoid excessive shadow stacking.

## Forms

- Appointment forms must stay minimal.
- Collect only the fields needed to request a visit and call the patient back.
- Do not collect diagnosis, personal ID, files, medical history, prescriptions, or sensitive medical documents.
- Keep consent and privacy copy visible near the submit button.
- Inputs and selects must have visible focus states and sufficient contrast.

## Footer

- Footer copy should be professional and compact.
- Include contact essentials and the small build marker.
- Do not turn the footer into a marketing or sitemap-heavy area.

## Content Standards

- Clinic content belongs in `clinicContent` in `public/app.js` unless there is a clear reason to move it.
- Demo doctors, prices, and services must remain clearly demo-safe.
- Do not claim real licenses, certifications, awards, official prices, or medical outcomes unless the client has confirmed them.
- Georgian healthcare copy should sound calm, precise, and human.

## Anti-Patterns

Avoid:

- Generic AI gradient blobs, decorative orbs, and bokeh backgrounds.
- Too many shadows, glows, or glass effects.
- Shop/ecommerce language or layout patterns.
- Cart, checkout, product-card, wishlist, or order-management affordances on the public clinic site.
- Dark crypto/SaaS dashboard styling.
- Fake medical claims, invented credentials, or overconfident price promises.
- Cluttered sections, oversized marketing hero patterns, and decorative UI that slows scanning.
