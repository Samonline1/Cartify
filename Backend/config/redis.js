// Redis config: client initialization & auto-reconnect policy
const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Client init
const redisClient = createClient({
  url: redisUrl,
  socket: {
    // Reconnect backoff (max 3s)
    reconnectStrategy: (retries) => {
      // Reconnect cap
      if (retries > 10) {
        console.warn("Redis: Maximum reconnect attempts reached. Operating in fail-open mode.");
        return false;
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

let isRedisConnected = false;

// Connect event
redisClient.on("connect", () => {
  console.log("Redis: Connecting...");
});

// Ready event
redisClient.on("ready", () => {
  isRedisConnected = true;
  console.log("Redis: Connected and ready to receive commands.");
});

// Error event
redisClient.on("error", (err) => {
  isRedisConnected = false;
  console.error("Redis connection error:", err.message);
});

// End event
redisClient.on("end", () => {
  isRedisConnected = false;
  console.warn("Redis: Connection closed.");
});

// Connect helper (fail-open)
async function connectRedis() {
  if (redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.connect();
  } catch (error) {
    console.warn("Redis connection failed on startup. Server running in fail-open mode:", error.message);
  }
}

// Health check
function isReady() {
  return redisClient.isReady;
}

module.exports = {
  redisClient,
  connectRedis,
  isReady,
};
