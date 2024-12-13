const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASS,
});

const LRU_CACHE_LIMIT = 25;

async function setKey(key, value) {
  if (
    typeof key !== "string" ||
    (typeof value !== "string" && typeof value !== "number")
  ) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    } else {
      throw new TypeError(
        "Key must be a string and value must be a string or number"
      );
    }
  }

  await redisClient.set(key, value);
  await redisClient.lPush("list", key);
  await redisClient.lTrim("list", 0, LRU_CACHE_LIMIT - 1);
  const size = await redisClient.lLen("list");
  if (size > LRU_CACHE_LIMIT) {
    const lruKey = await redisClient.rPop("list");
    if (lruKey) {
      await redisClient.del(lruKey);
    }
  }
}

async function getKey(key) {
  const value = await redisClient.get(key);
  return value;
}

(async () => {
  redisClient.on("error", (err) => {
    console.error("Redis client error:", err);
  });

  redisClient.on("ready", () => {
    console.log("Redis client is ready");
  });

  await redisClient.connect();
})();

module.exports = { getKey, setKey };
