const pubSub = require("./pubSub");

describe("Pub sub", () => {
  describe("Backoff", () => {
    it("should back off a minimum of 1 seconds", () => {
      expect(pubSub.REDIS_OPTIONS.retry_strategy({ attempt: 1 })).toEqual(1000);
      expect(pubSub.REDIS_OPTIONS.retry_strategy({ attempt: 5 })).toEqual(1000);
    });

    it("should reduce back off as retries", () => {
      expect(pubSub.REDIS_OPTIONS.retry_strategy({ attempt: 15 })).toEqual(
        1500
      );
      expect(pubSub.REDIS_OPTIONS.retry_strategy({ attempt: 20 })).toEqual(
        2000
      );
    });

    it("should limit the retry time to 10 seconds", () => {
      expect(pubSub.REDIS_OPTIONS.retry_strategy({ attempt: 200 })).toEqual(
        10000
      );
    });
  });
});
