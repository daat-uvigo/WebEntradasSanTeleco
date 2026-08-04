# Web Entradas San Teleco

## Astro

This project uses [Astro](https://astro.build/) for frontend static generation and API endpoints to implement backend logic

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally, before deploying     |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help`    | Get help using the Astro CLI                     |
| `pnpm exec drizzle-kit push`    | Update/Generate db schema                        |
| `rm reservas.db`          | Removes local DB file                            |

## Styling

- [TailwindCSS](https://tailwindcss.com/)
- [HyperUI](https://www.hyperui.dev/)

## Database

- [LibSQL](https://github.com/tursodatabase/libsql) ([Turso Cloud](https://turso.tech/) or LibSQL Embbedded database)
- [DrizzleORM](https://orm.drizzle.team/) (Database safe operations with abstraction)
- [Zod](https://zod.dev/) (Database schema validation)

## How to use with local database

1. Add to .env LOCAL=true
2. Add to .env DB_FILE_NAME=file:reservas.db

Now you should use `pnpm exec drizzle-kit push` to create the initial database schema

## How to use with Turso cloud database

By default the project uses turso for the database but you need to do some steps to configure it:

1. Create turso account and new database
2. Add to .env LOCAL=false
2. Add to .env DB_FILE_NAME=<turso_url>
3. Add to .env DB_TOKEN=<turso_token>

Now you should use `pnpm exec drizzle-kit push` to create the initial database schema

## How to be able to submit forms

1. Generate custom secret: openssl rand -base64 48
2. Add secret to .env HMAC_KEY=<secret>

## How to be able to send cloud emails

1. Create a resend account
2. Create template named "reservation-confirmation" with variable "nombre_completo" and \<img src="cid:qr" \/> for the QR code
3. Add your custom domain to resend modifying DNS records of the domain
4. Add secret api key to .env RESEND_API_KEY=<api_key>
5. Add email address to .env EMAIL_ADDRESS=<email_address> (the address must be in the custom domain added)

## How to be able to send Gmail Workspace emails

1. Add to .env LOCAL=true
2. Add to .env GOOGLE_APP_PASSWORD=<GOOGLE_APP_PASSWORD> (https://myaccount.google.com/apppasswords)
3. Add email address to .env EMAIL_ADDRESS=<email_address> (the address must be in the custom domain of the workspace)
### Example .env file

```env
# For Gmail & SQLite (else RESEND & TURSO)
LOCAL=true
DB_FILE_NAME=file:reservas.db
DB_TOKEN=xxx
HMAC_KEY=B78T0uXf+PxvGBEUoGSXWL0d+98bwRasOR0wyj14LvhMHTU3dyIGO3m4uMLrlyTu

EMAIL_ADDRESS=santeleco@daat.uvigo.es
# Gmail
GOOGLE_APP_PASSWORD=xxx
# Resend
RESEND_API_KEY=re_xxx
``` 