import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL, {
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
  retryStrategy: () => null,
});

let isRedisAvailable = true;

redisClient.on("error", (err) => {
  if (isRedisAvailable) {
    console.error("[Redis]: unavailable, cache disabled.", err.message);
  }
  isRedisAvailable = false;
});

async function safeRedisCall(call, fallbackValue) {
  if (!isRedisAvailable) {
    return fallbackValue;
  }

  try {
    if (redisClient.status === "wait") {
      await redisClient.connect();
    }
    return await call();
  } catch (err) {
    if (isRedisAvailable) {
      console.error("[Redis]: request failed, cache disabled.", err.message);
    }
    isRedisAvailable = false;
    try {
      redisClient.disconnect();
    } catch {
      // ignore disconnect errors
    }
    return fallbackValue;
  }
}

const redis = {
  get(key) {
    return safeRedisCall(() => redisClient.get(key), null);
  },
  set(...args) {
    return safeRedisCall(() => redisClient.set(...args), "OK");
  },
  del(...args) {
    return safeRedisCall(() => redisClient.del(...args), 0);
  },
};

export default redis;
