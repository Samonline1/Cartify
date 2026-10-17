// Rate limit middleware: IP and Composite throttling
const { consumeRateLimit } = require("../services/rateLimiterService");

// Extract IP
function getCleanIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp) return firstIp;
  }
  return req.ip || req.socket?.remoteAddress || "127.0.0.1";
}

// Composite key (IP + Email)
function getLoginKey(req, prefix = "rl:login") {
  const ip = getCleanIp(req);
  const email = (req.body?.email || "").toLowerCase().trim();
  return email ? `${prefix}:${ip}:${email}` : `${prefix}:${ip}`;
}

// Middleware factory
function createRateLimiter({
  windowSeconds = 300,
  max = 5,
  keyGenerator,
  message,
}) {
  return async (req, res, next) => {
    // Generate key
    const key = keyGenerator ? keyGenerator(req) : `rl:general:${getCleanIp(req)}`;

    // Consume limit
    const { allowed, limit, remaining, ttl } = await consumeRateLimit(
      key,
      max,
      windowSeconds
    );

    // Set headers
    res.setHeader("RateLimit-Limit", limit);
    res.setHeader("RateLimit-Remaining", remaining);
    res.setHeader("RateLimit-Reset", ttl);

    // Lockout check
    if (!allowed) {
      res.setHeader("Retry-After", ttl);

      const defaultMsg = `Too many requests. Please try again after ${Math.ceil(ttl / 60)} minute(s).`;
      return res.status(429).json({
        success: false,
        msg: message || defaultMsg,
        retryAfter: ttl,
      });
    }

    // Attach key for strike reset
    req.rateLimitKey = key;
    next();
  };
}

// Preconfigured limiters

// Signup limiter (IP: 5 per 15m)
const signupLimiter = createRateLimiter({
  windowSeconds: 15 * 60,
  max: 5,
  keyGenerator: (req) => `rl:signup:${getCleanIp(req)}`,
  message: "Too many accounts created from this IP. Please try again after 15 minutes.",
});

// Login limiter (IP+Email: 5 per 5m)
const loginLimiter = createRateLimiter({
  windowSeconds: 5 * 60,
  max: 5,
  keyGenerator: (req) => getLoginKey(req, "rl:login"),
  message: "Too many login attempts for this account from this IP. Please try again after 5 minutes.",
});

// Admin limiter (IP+Email: 3 per 15m)
const adminLoginLimiter = createRateLimiter({
  windowSeconds: 15 * 60,
  max: 3,
  keyGenerator: (req) => getLoginKey(req, "rl:admin-login"),
  message: "Too many admin login attempts. Access temporarily locked for 15 minutes.",
});

// Search limiter (IP: 30 per 1m)
const searchLimiter = createRateLimiter({
  windowSeconds: 60,
  max: 30,
  keyGenerator: (req) => `rl:search:${getCleanIp(req)}`,
  message: "Too many search requests. Please slow down.",
});

module.exports = {
  createRateLimiter,
  signupLimiter,
  loginLimiter,
  adminLoginLimiter,
  searchLimiter,
  getCleanIp,
  getLoginKey,
};
