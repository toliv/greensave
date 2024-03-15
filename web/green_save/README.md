## Getting Started

1. Start Postgres in Docker container (found in root directory) `docker compose up -d`
2. Install dependencies `npm install`
3. Apply the database migrations `DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public" npx prisma migrate reset`
4. Start the app `DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public" npm run dev`
5. Visit `http://localhost:3000`

## .env file

If you wish to not append `DATABASE_URL` to every prisma command, create a `.env` file in this directory `web/green_save/.env` with the following content:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
```

## Data scripts

The `./scripts` directory contains scripts to map some data from Google Sheets into db rows, but are not required to run the app at this point in time (features under development).
