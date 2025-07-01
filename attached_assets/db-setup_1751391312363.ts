import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, calls } from "@shared/schema";

async function setupDatabase() {
  try {
    console.log("Setting up database...");
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client);

    // Test connection and create tables
    console.log("Testing database connection...");
    
    // Create tables using raw SQL to ensure they exist
    await client`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        credits INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS calls (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        from_number TEXT NOT NULL,
        to_number TEXT NOT NULL,
        duration INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        transcript TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log("Database setup completed successfully!");
    
    // Test a simple query
    const result = await client`SELECT 1 as test`;
    console.log("Database connection test:", result[0]);
    
  } catch (error) {
    console.error("Database setup failed:", error);
    throw error;
  }
}

export { setupDatabase };