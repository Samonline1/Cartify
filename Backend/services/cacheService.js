// Cache Service: Cache-Aside pattern
const { redisClient, isReady } = require("../config/redis");

// Cache get
async function get(key) {
  // Fail-open check
  if (!isReady()) return null;

  try {
    const raw = await redisClient.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Cache: Error retrieving key "${key}", failing open:`, error.message);
    return null;
  }
}

// Cache set
async function set(key, value, ttlSeconds = 3600) {
  // Fail-open check
  if (!isReady()) return false;

  try {
    const payload = JSON.stringify(value);
    if (ttlSeconds && ttlSeconds > 0) {
      await redisClient.set(key, payload, { EX: ttlSeconds });
    } else {
      await redisClient.set(key, payload);
    }
    return true;
  } catch (error) {
    console.warn(`Cache: Error setting key "${key}":`, error.message);
    return false;
  }
}

// Cache delete
async function del(key) {
  // Fail-open check
  if (!isReady()) return false;

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.warn(`Cache: Error deleting key "${key}":`, error.message);
    return false;
  }
}

// Pattern delete: non-blocking SCAN
async function delPattern(pattern) {
  // Fail-open check
  if (!isReady()) return 0;

  try {
    let cursor = 0;
    let deletedCount = 0;

    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = reply.cursor;
      const keys = reply.keys;

      if (keys.length > 0) {
        await redisClient.del(keys);
        deletedCount += keys.length;
      }
    } while (cursor !== 0);

    return deletedCount;
  } catch (error) {
    console.warn(`Cache: Error deleting pattern "${pattern}":`, error.message);
    return 0;
  }
}

// Cache-aside helper
async function getOrSet(key, ttlSeconds, fetcherFn) {
  // Cache hit
  const cached = await get(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss
  const fresh = await fetcherFn();
  if (fresh !== null && fresh !== undefined) {
    await set(key, fresh, ttlSeconds);
  }
  return fresh;
}

module.exports = {
  get,
  set,
  del,
  delPattern,
  getOrSet,
};
