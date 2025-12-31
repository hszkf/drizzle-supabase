import { Hono } from "hono";
import { testConnection } from "../../db/test-connection";

export const healthRouter = new Hono();

healthRouter.get("/", async (c) => {
  const dbStatus = await testConnection();

  const health = {
    status: dbStatus.success ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      api: "ok",
      database: dbStatus.success ? "ok" : "error",
    },
    database: dbStatus.success ? dbStatus.details : { error: dbStatus.message },
  };

  return c.json(health, dbStatus.success ? 200 : 503);
});

healthRouter.get("/live", (c) => {
  return c.json({ status: "ok" });
});

healthRouter.get("/ready", async (c) => {
  const dbStatus = await testConnection();
  if (!dbStatus.success) {
    return c.json({ status: "not ready", reason: dbStatus.message }, 503);
  }
  return c.json({ status: "ready" });
});
