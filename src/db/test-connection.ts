import postgres from "postgres";

export async function testConnection(): Promise<{
  success: boolean;
  message: string;
  details?: {
    version: string;
    database: string;
    user: string;
  };
}> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return {
      success: false,
      message: "DATABASE_URL environment variable is not set",
    };
  }

  const sql = postgres(connectionString, { prepare: false, max: 1 });

  try {
    const result = await sql`
      SELECT
        version() as version,
        current_database() as database,
        current_user as user
    `;

    await sql.end();

    return {
      success: true,
      message: "Database connection successful",
      details: {
        version: result[0].version.split(" ").slice(0, 2).join(" "),
        database: result[0].database,
        user: result[0].user,
      },
    };
  } catch (error) {
    await sql.end();
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Run directly
if (import.meta.main) {
  const result = await testConnection();
  if (result.success) {
    console.log("✓ " + result.message);
    console.log("  Database:", result.details?.database);
    console.log("  User:", result.details?.user);
    console.log("  Version:", result.details?.version);
  } else {
    console.error("✗ " + result.message);
    process.exit(1);
  }
}
