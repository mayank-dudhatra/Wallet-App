const rateLimiterInstance = require("../config/upstash.js");

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await rateLimiterInstance.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }

    next(); // ✅ Move this outside the if-block
  } catch (error) {
    console.error("Rate Limit Error:", error);
    next(error);
  }
};

module.exports = rateLimiter; // ✅ CommonJS export