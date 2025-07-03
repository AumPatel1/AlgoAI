import "dotenv/config";
import type { Config } from "drizzle-kit";

// Check for required environment variables
if (!process.env.DATABASE_URL && (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME)) {
  throw new Error("Missing required database environment variables. Either provide DATABASE_URL or DB_HOST, DB_USER, DB_PASSWORD, DB_NAME");
}

// Use DATABASE_URL for production (Supabase/Vercel), individual credentials for local development
const config: Config = process.env.DATABASE_URL ? {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} : {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: 5432,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: true,
  },
};

export default config;
