import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../../db";
import { posts, users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const postsRouter = new Hono();

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  published: z.boolean().default(false),
  authorId: z.string().uuid().optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
});

// GET /api/posts
postsRouter.get("/", async (c) => {
  const allPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      published: posts.published,
      authorId: posts.authorId,
      authorName: users.name,
      authorEmail: users.email,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id));

  return c.json(allPosts);
});

// GET /api/posts/:id
postsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      published: posts.published,
      authorId: posts.authorId,
      authorName: users.name,
      authorEmail: users.email,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, id));

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});

// POST /api/posts
postsRouter.post("/", zValidator("json", createPostSchema), async (c) => {
  const body = c.req.valid("json");

  const [post] = await db.insert(posts).values(body).returning();
  return c.json(post, 201);
});

// PATCH /api/posts/:id
postsRouter.patch("/:id", zValidator("json", updatePostSchema), async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json");

  const [post] = await db
    .update(posts)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});

// DELETE /api/posts/:id
postsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const [post] = await db.delete(posts).where(eq(posts.id, id)).returning();

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json({ message: "Post deleted" });
});
