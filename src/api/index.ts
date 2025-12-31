import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { usersRouter } from "./routes/users";
import { postsRouter } from "./routes/posts";
import { healthRouter } from "./routes/health";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Routes
app.route("/health", healthRouter);
app.route("/api/users", usersRouter);
app.route("/api/posts", postsRouter);

// Root
app.get("/", (c) => {
  return c.json({
    name: "drizzle-supabase",
    version: "1.0.0",
    endpoints: ["/health", "/api/users", "/api/posts"],
  });
});

export default app;
export { app };
