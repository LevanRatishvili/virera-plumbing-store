# Admin Access

The appointment admin area is available at `/admin` and `/#/admin`.

## Password

Set `ADMIN_PASSWORD` before using admin access.

Local PowerShell example:

```powershell
$env:ADMIN_PASSWORD="replace-with-a-strong-password"
npm start
```

Local development has a fallback password of `dev-admin` only when `NODE_ENV` is not `production`.

Production has no fallback. If `ADMIN_PASSWORD` is missing in production, the admin login is disabled and protected admin APIs return unauthorized.

## Render

In Render, open the web service environment settings and add:

```text
ADMIN_PASSWORD=<strong private password>
```

Redeploy after changing the environment variable.

## Login And Logout

Go to `/admin`, enter the admin password, and use the `გასვლა` button to clear the session cookie.

The session is stored in an httpOnly `admin_session` cookie and expires after 8 hours.

## Protected APIs

These routes require an authenticated admin session:

- `GET /api/admin/appointments`
- `PATCH /api/admin/appointments/:id/status`
- legacy admin product routes under `/api/admin/`
- legacy admin list/update routes such as orders, customers, contact messages, and stock updates

The public `POST /api/appointments` route remains open.

## Future Security Work

- Replace the single shared password with proper user accounts if multiple admins are needed.
- Persist server-side sessions if multi-instance deployment is introduced.
- Add CSRF protection before adding higher-risk admin actions.
- Add audit logging for status changes.
