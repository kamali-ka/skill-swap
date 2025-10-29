// src/index.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { clerkPlugin } from "@clerk/fastify";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });

// === CORS Setup ===
fastify.register(cors, {
  origin: "http://localhost:5173", // Vite frontend URL
  credentials: true,
});

// === Clerk Plugin ===
fastify.register(clerkPlugin, {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
});

// === Test Route (Unprotected) ===
fastify.get("/", async () => {
  return { message: "Skill Swap Backend is running!" };
});

// === Protected Route Example ===
fastify.get("/api/profile", async (request, reply) => {
  const userId = request.auth?.userId;

  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  // Example: return only Clerk userId for now
  return { userId };
});

// === Start Server ===
const start = async () => {
  try {
    await fastify.listen({ port: 4000 });
    console.log("Backend running at http://localhost:4000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
