import { db } from "./src/db";
import { users, posts } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  // Example: Create a user
  const [user] = await db
    .insert(users)
    .values({
      email: "test@example.com",
      name: "Test User",
    })
    .returning();

  console.log("Created user:", user);

  // Example: Create a post
  const [post] = await db
    .insert(posts)
    .values({
      title: "Hello World",
      content: "This is my first post!",
      authorId: user.id,
      published: true,
    })
    .returning();

  console.log("Created post:", post);

  // Example: Query with relations
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true));

  console.log("Published posts:", allPosts);

  process.exit(0);
}

main().catch(console.error);
