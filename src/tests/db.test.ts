import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { testConnection } from "../db/test-connection";
import { db } from "../db";
import { users, posts } from "../db/schema";
import { eq } from "drizzle-orm";

describe("Database Connection", () => {
  test("should connect to database successfully", async () => {
    const result = await testConnection();

    expect(result.success).toBe(true);
    expect(result.message).toBe("Database connection successful");
    expect(result.details).toBeDefined();
    expect(result.details?.database).toBeDefined();
    expect(result.details?.user).toBeDefined();
    expect(result.details?.version).toContain("PostgreSQL");
  });

  test("should have DATABASE_URL environment variable", () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.DATABASE_URL).toContain("postgres");
  });
});

describe("Drizzle ORM Operations", () => {
  let testUserId: string;
  let testPostId: string;

  afterAll(async () => {
    // Cleanup test data
    if (testPostId) {
      await db.delete(posts).where(eq(posts.id, testPostId));
    }
    if (testUserId) {
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });

  test("should insert a user", async () => {
    const email = `test-${Date.now()}@example.com`;

    const [user] = await db
      .insert(users)
      .values({
        email,
        name: "Test User",
      })
      .returning();

    testUserId = user.id;

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe(email);
    expect(user.name).toBe("Test User");
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  test("should query users", async () => {
    const allUsers = await db.select().from(users);

    expect(Array.isArray(allUsers)).toBe(true);
    expect(allUsers.length).toBeGreaterThan(0);
  });

  test("should query user by id", async () => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, testUserId));

    expect(user).toBeDefined();
    expect(user.id).toBe(testUserId);
  });

  test("should update a user", async () => {
    const [updated] = await db
      .update(users)
      .set({ name: "Updated Name" })
      .where(eq(users.id, testUserId))
      .returning();

    expect(updated.name).toBe("Updated Name");
  });

  test("should insert a post with author relation", async () => {
    const [post] = await db
      .insert(posts)
      .values({
        title: "Test Post",
        content: "Test content",
        authorId: testUserId,
        published: true,
      })
      .returning();

    testPostId = post.id;

    expect(post).toBeDefined();
    expect(post.title).toBe("Test Post");
    expect(post.authorId).toBe(testUserId);
  });

  test("should query posts with author join", async () => {
    const result = await db
      .select({
        postId: posts.id,
        postTitle: posts.title,
        authorName: users.name,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, testPostId));

    expect(result.length).toBe(1);
    expect(result[0].postTitle).toBe("Test Post");
    expect(result[0].authorName).toBe("Updated Name");
  });
});
