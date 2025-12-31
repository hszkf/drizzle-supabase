import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const usersRouter = new Hono();

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
});

// GET /api/users
usersRouter.get("/", async (c) => {
  const allUsers = await db.select().from(users);
  return c.json(allUsers);
});

// GET /api/users/:id
usersRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const [user] = await db.select().from(users).where(eq(users.id, id));

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

// POST /api/users
usersRouter.post("/", zValidator("json", createUserSchema), async (c) => {
  const body = c.req.valid("json");

  try {
    const [user] = await db.insert(users).values(body).returning();
    return c.json(user, 201);
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique")) {
      return c.json({ error: "Email already exists" }, 409);
    }
    throw error;
  }
});

// PATCH /api/users/:id
usersRouter.patch("/:id", zValidator("json", updateUserSchema), async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json");

  const [user] = await db
    .update(users)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

// DELETE /api/users/:id
usersRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const [user] = await db.delete(users).where(eq(users.id, id)).returning();

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ message: "User deleted" });
});
