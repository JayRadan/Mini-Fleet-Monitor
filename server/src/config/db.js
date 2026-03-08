// STEP 1: Import Pool from pg.
// STEP 2: Import DATABASE_URL from env config.
// STEP 3: Create and export a shared pool instance.
// STEP 4: Optionally add a small helper for test query/health check.
import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

const checkDbConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("[DB]: successfully connected");
  } catch (err) {
    console.error("[DB]:error", err);
    process.exit(1); // Exit if DB connection fails
  }
};

export { checkDbConnection };
