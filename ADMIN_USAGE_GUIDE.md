# Admin Usage Guide

## Content Backup

- Open `/admin` and log in.
- In `საიტის კონტენტი`, use `კონტენტის ექსპორტი` before major deploys or broad content edits.
- The downloaded `clinic-content-backup-YYYY-MM-DD.json` contains site content, export time, and build metadata only.
- It does not include admin passwords, sessions, appointments, patient requests, or secrets.

## Content Restore

- Use `კონტენტის იმპორტი` and choose a previously exported JSON backup.
- Imported content is validated before saving.
- Unsafe scripts, external image URLs, suspicious paths, invalid sections, and oversized content are rejected.

## Section Reset

- Section reset buttons restore only the selected section to demo defaults.
- Available resets cover slider, services, doctors, prices, contact, and footer/consent.
- `დემო ტექსტზე დაბრუნება` clears all saved content overrides.

## Images

- Image upload is not enabled yet.
- Image fields can use existing local `/assets/...` files from the picker or a manually entered safe local path.
- External URLs, `javascript:`, `data:`, and suspicious paths are rejected.

## Storage Note

- Current admin-edited content is saved in the site database/storage.
- On Render, persistence depends on the configured persistent disk or database setup.
- Export a JSON backup before major updates.
- Permanent image upload/storage should be added only after a storage decision.
