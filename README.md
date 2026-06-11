# VirEra Plumbing Store

Premium dark-showroom plumbing, bathroom, and interior products store for the Gori demo market.

The project is a vanilla frontend with a local Node.js backend, SQLite database, Prisma schema reference, admin product management, CSV product import, order requests, contact/operator requests, cart/wishlist, and a Georgian AI sales assistant fallback.

## Tech Stack

- Node.js HTTP server
- SQLite via `node:sqlite`
- Prisma schema in `prisma/schema.prisma`
- Vanilla HTML/CSS/JavaScript frontend in `public/`
- Demo database in `data/store.sqlite`

## Requirements

- Node.js 24 or newer
- npm

Node 24 is required because the backend uses `node:sqlite`.

## Local Setup

```bash
npm install
npm run check
npm start
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm start
```

Starts the production server with `node src/server.js`.

```bash
npm run check
```

Runs syntax checks for the backend and frontend.

```bash
npm run prisma:validate
```

Validates the Prisma schema.

## Environment Variables

Optional:

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini
PORT=3000
```

If `OPENAI_API_KEY` is not set, the AI assistant remains available in local rule-based mode. The API key is used only on the backend and is never exposed to the frontend.

## Database

The demo SQLite database is kept at:

```text
data/store.sqlite
```

The app creates missing tables and seeds demo catalog data automatically on startup through `initDatabase()`.

For the live demo, keep `data/store.sqlite` in the repository so the deployed service starts with the prepared demo catalog and admin data.

Ignored SQLite runtime files:

```text
data/*.sqlite-journal
data/*.sqlite-wal
data/*.sqlite-shm
```

## Admin Demo Notes

Open:

```text
http://localhost:3000/#/admin
```

Admin includes:

- product table
- product add/edit/delete
- CSV product import
- order requests
- customer phone numbers
- requested products
- order status changes
- inventory quick edit
- contact/operator requests

## CSV Import

Admin CSV import accepts these columns:

```text
SKU,name,category,brand,description,price,salePrice,stock,images,attributes,status
```

Notes:

- `SKU` is required and unique.
- Existing SKU updates the product.
- New SKU creates a product.
- Duplicate SKU inside the uploaded file is skipped.
- Bad rows are skipped and reported.
- `price` is the current price.
- `salePrice` is used as the comparison/old price.

## Render Deployment

This repository includes `render.yaml`.

Recommended Render Web Service settings:

```text
Build Command: npm install
Start Command: npm start
Node Version: 24.12.0
```

The included `render.yaml` also defines a persistent disk mounted at:

```text
/opt/render/project/src/data
```

This keeps `store.sqlite` persistent after deploys. If you do not use a persistent disk, Render's filesystem may reset data between deploys.

### Automatic Deploys

Render's GitHub Auto-Deploy should stay enabled for the service, but this repository also includes a fallback GitHub Actions workflow:

```text
.github/workflows/render-deploy.yml
```

On every push to `main`, GitHub Actions calls the Render Deploy Hook stored in this GitHub secret:

```text
RENDER_DEPLOY_HOOK_URL
```

After adding or rotating the secret, run the `Trigger Render Deploy` workflow manually from GitHub Actions once to verify the connection without creating another commit.

Do not commit the deploy hook URL. Store it only as a GitHub Actions secret, a shell environment variable, or a local ignored file named:

```text
.render-deploy.env
```

Example local file:

```text
RENDER_DEPLOY_HOOK_URL=https://api.render.com/deploy/...
```

Local fallback command after a successful push to `main`:

```bash
npm run deploy:render
```

Deployment verification:

```bash
git ls-remote origin refs/heads/main
curl https://virera.live/api/deployment
```

The deployment endpoint reports Render's `RENDER_GIT_COMMIT` when Render provides it, so production can be compared with GitHub `main`.

## Cloudflare DNS For virera.live

After Render creates the service, add the custom domains in Render:

```text
virera.live
www.virera.live
```

Expected Cloudflare records after the Render service is created:

```text
Type: CNAME
Name: @
Target: virera-plumbing-store.onrender.com
Proxy status: DNS only while Render verifies the domain
TTL: Auto
```

```text
Type: CNAME
Name: www
Target: virera-plumbing-store.onrender.com
Proxy status: DNS only while Render verifies the domain
TTL: Auto
```

Also remove any `AAAA` records for `virera.live` and `www.virera.live`, because Render uses IPv4 routing for custom domains. In Cloudflare SSL/TLS, use `Full` mode.

If Render gives a different `onrender.com` target after service creation, use Render's exact target as the source of truth.

Important:

```text
n8n.virera.live DNS should not be changed.
```

Only update records for:

```text
virera.live
www.virera.live
```

## GitHub Repository

Suggested repository name:

```text
virera-plumbing-store
```

Recommended push flow:

```bash
git init
git branch -M main
git add .
git commit -m "Prepare plumbing store for deployment"
git remote add origin https://github.com/<OWNER>/virera-plumbing-store.git
git push -u origin main
```

Do not commit:

- `node_modules`
- `.env`
- log files
- SQLite journal/WAL/SHM files

## Production Smoke Test

After deployment, verify:

- homepage
- shop
- product detail
- add to order/cart
- order request
- admin products
- admin order requests
- AI assistant
- mobile layout
