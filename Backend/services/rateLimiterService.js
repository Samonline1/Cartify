// Rate limit service: atomic Redis counter
const { redisClient, isReady } = require("../config/redis");

// Consume limit
async function consumeRateLimit(key, maxRequests, windowSeconds) {
  // Fail-open check
  if (!isReady()) {
    return {
      allowed: true,
      current: 0,
      limit: maxRequests,
      remaining: maxRequests,
      ttl: 0,
      isFallback: true,
    };
  }

  try {
    // Atomic increment
    const current = await redisClient.incr(key);

    // Set window TTL
    if (current === 1) {
      await redisClient.expire(key, windowSeconds);
    }

    // Read TTL
    let ttl = await redisClient.ttl(key);
    if (ttl === -1) {
      await redisClient.expire(key, windowSeconds);
      ttl = windowSeconds;
    }

    // Check allowance
    const remaining = Math.max(0, maxRequests - current);
    const allowed = current <= maxRequests;

    return {
      allowed,
      current,
      limit: maxRequests,
      remaining,
      ttl: Math.max(ttl, 1),
      isFallback: false,
    };
  } catch (error) {
    console.warn(`RateLimiter: Redis error on key "${key}", failing open:`, error.message);
    return {
      allowed: true,
      current: 0,
      limit: maxRequests,
      remaining: maxRequests,
      ttl: 0,
      isFallback: true,
    };
  }
}

// Reset strikes (on successful login)
async function resetRateLimit(key) {
  // Fail-open check
  if (!isReady()) return;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.warn(`RateLimiter: Failed to delete key "${key}":`, error.message);
  }
}

// Decrement strike
async function decrementRateLimit(key) {
  // Fail-open check
  if (!isReady()) return;

  try {
    await redisClient.decr(key);
  } catch (error) {
    console.warn(`RateLimiter: Failed to decrement key "${key}":`, error.message);
  }
}

module.exports = {
  consumeRateLimit,
  resetRateLimit,
  decrementRateLimit,
};
