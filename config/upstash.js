const { Redis } = require('@upstash/redis');
const { Ratelimit } = require('@upstash/ratelimit');
require('dotenv').config();

// Create Redis client from environment variables
const redis = Redis.fromEnv();

// Set up rate limiter with sliding window: 100 requests per 60 seconds
const ratelimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
  analytics: true,
});

module.exports = ratelimiter;
