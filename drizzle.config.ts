import { defineConfig } from "drizzle-kit"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to use Drizzle Kit.")
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/shared/database/schema/index.ts",
  out: "./src/shared/database/migrations",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
})
