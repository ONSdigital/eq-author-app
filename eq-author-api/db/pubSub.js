const { RedisPubSub } = require("graphql-redis-subscriptions");
const Redis = require("ioredis");
const { clamp } = require("lodash");

const REDIS_OPTIONS = {
  host: process.env.REDIS_DOMAIN_NAME,
  port: process.env.REDIS_PORT,
  // eslint-disable-next-line camelcase
  retry_strategy: (options) => {
    // reconnect after
    return clamp(options.attempt * 100, 1000, 10000);
  },
};

const pubsub = new RedisPubSub({
  publisher: new Redis(REDIS_OPTIONS),
  subscriber: new Redis(REDIS_OPTIONS),
});

module.exports = pubsub;
module.exports.REDIS_OPTIONS = REDIS_OPTIONS;
