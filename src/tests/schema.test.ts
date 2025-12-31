import { describe, test, expect } from "bun:test";
import { users, posts } from "../db/schema";
import { getTableColumns } from "drizzle-orm";

describe("Drizzle Schema Validation", () => {
  describe("Users Table", () => {
    const columns = getTableColumns(users);

    test("should have id column as UUID primary key", () => {
      expect(columns.id).toBeDefined();
      expect(columns.id.dataType).toBe("string");
      expect(columns.id.primary).toBe(true);
    });

    test("should have email column as unique not null", () => {
      expect(columns.email).toBeDefined();
      expect(columns.email.notNull).toBe(true);
      expect(columns.email.isUnique).toBe(true);
    });

    test("should have name column as optional", () => {
      expect(columns.name).toBeDefined();
      expect(columns.name.notNull).toBe(false);
    });

    test("should have createdAt column with default", () => {
      expect(columns.createdAt).toBeDefined();
      expect(columns.createdAt.notNull).toBe(true);
      expect(columns.createdAt.hasDefault).toBe(true);
    });

    test("should have updatedAt column with default", () => {
      expect(columns.updatedAt).toBeDefined();
      expect(columns.updatedAt.notNull).toBe(true);
      expect(columns.updatedAt.hasDefault).toBe(true);
    });
  });

  describe("Posts Table", () => {
    const columns = getTableColumns(posts);

    test("should have id column as UUID primary key", () => {
      expect(columns.id).toBeDefined();
      expect(columns.id.dataType).toBe("string");
      expect(columns.id.primary).toBe(true);
    });

    test("should have title column as not null", () => {
      expect(columns.title).toBeDefined();
      expect(columns.title.notNull).toBe(true);
    });

    test("should have content column as optional", () => {
      expect(columns.content).toBeDefined();
      expect(columns.content.notNull).toBe(false);
    });

    test("should have published column with default false", () => {
      expect(columns.published).toBeDefined();
      expect(columns.published.notNull).toBe(true);
      expect(columns.published.hasDefault).toBe(true);
    });

    test("should have authorId column as optional UUID", () => {
      expect(columns.authorId).toBeDefined();
      expect(columns.authorId.notNull).toBe(false);
    });

    test("should have timestamp columns", () => {
      expect(columns.createdAt).toBeDefined();
      expect(columns.updatedAt).toBeDefined();
    });
  });
});
