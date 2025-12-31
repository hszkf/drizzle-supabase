import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { app } from "../api";

describe("API Health Endpoints", () => {
  test("GET / should return API info", async () => {
    const res = await app.request("/");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.name).toBe("drizzle-supabase");
    expect(body.endpoints).toContain("/health");
    expect(body.endpoints).toContain("/api/users");
    expect(body.endpoints).toContain("/api/posts");
  });

  test("GET /health/live should return ok", async () => {
    const res = await app.request("/health/live");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("ok");
  });

  test("GET /health should return database status", async () => {
    const res = await app.request("/health");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("healthy");
    expect(body.services.api).toBe("ok");
    expect(body.services.database).toBe("ok");
    expect(body.database).toBeDefined();
  });

  test("GET /health/ready should confirm readiness", async () => {
    const res = await app.request("/health/ready");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("ready");
  });
});

describe("API Users Endpoints", () => {
  let testUserId: string;
  const testEmail = `api-test-${Date.now()}@example.com`;

  afterAll(async () => {
    // Cleanup
    if (testUserId) {
      await app.request(`/api/users/${testUserId}`, { method: "DELETE" });
    }
  });

  test("POST /api/users should create a user", async () => {
    const res = await app.request("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, name: "API Test User" }),
    });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.email).toBe(testEmail);
    expect(body.name).toBe("API Test User");
    expect(body.id).toBeDefined();

    testUserId = body.id;
  });

  test("POST /api/users with invalid email should return 400", async () => {
    const res = await app.request("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid-email" }),
    });

    expect(res.status).toBe(400);
  });

  test("GET /api/users should return users list", async () => {
    const res = await app.request("/api/users");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /api/users/:id should return a user", async () => {
    const res = await app.request(`/api/users/${testUserId}`);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.id).toBe(testUserId);
    expect(body.email).toBe(testEmail);
  });

  test("GET /api/users/:id with invalid id should return 404", async () => {
    const res = await app.request(
      "/api/users/00000000-0000-0000-0000-000000000000",
    );
    expect(res.status).toBe(404);
  });

  test("PATCH /api/users/:id should update a user", async () => {
    const res = await app.request(`/api/users/${testUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated API User" }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.name).toBe("Updated API User");
  });
});

describe("API Posts Endpoints", () => {
  let testUserId: string;
  let testPostId: string;
  const testEmail = `post-api-test-${Date.now()}@example.com`;

  beforeAll(async () => {
    // Create a user for posts
    const res = await app.request("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, name: "Post Author" }),
    });
    const body = await res.json();
    testUserId = body.id;
  });

  afterAll(async () => {
    if (testPostId) {
      await app.request(`/api/posts/${testPostId}`, { method: "DELETE" });
    }
    if (testUserId) {
      await app.request(`/api/users/${testUserId}`, { method: "DELETE" });
    }
  });

  test("POST /api/posts should create a post", async () => {
    const res = await app.request("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Post",
        content: "Test content",
        authorId: testUserId,
        published: true,
      }),
    });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.title).toBe("Test Post");
    expect(body.authorId).toBe(testUserId);

    testPostId = body.id;
  });

  test("GET /api/posts should return posts with author info", async () => {
    const res = await app.request("/api/posts");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    const post = body.find((p: any) => p.id === testPostId);
    expect(post).toBeDefined();
    expect(post.authorName).toBe("Post Author");
  });

  test("GET /api/posts/:id should return a post", async () => {
    const res = await app.request(`/api/posts/${testPostId}`);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.id).toBe(testPostId);
    expect(body.title).toBe("Test Post");
  });

  test("PATCH /api/posts/:id should update a post", async () => {
    const res = await app.request(`/api/posts/${testPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated Title" }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.title).toBe("Updated Title");
  });

  test("DELETE /api/posts/:id should delete a post", async () => {
    const res = await app.request(`/api/posts/${testPostId}`, {
      method: "DELETE",
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.message).toBe("Post deleted");

    testPostId = ""; // Clear so afterAll doesn't try to delete again
  });
});
