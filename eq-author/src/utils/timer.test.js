import timer from "./timer";

jest.useFakeTimers();

const dateNow = Date.now;

describe("timer", () => {
  const TIMEOUT = 1000;
  let t, handleDone, currentTime;

  const advanceByTime = (amount) => {
    currentTime += amount;
    jest.runTimersToTime(amount);
  };

  beforeEach(() => {
    currentTime = 0;
    Date.now = jest.fn(() => currentTime);
    handleDone = jest.fn();
    t = timer(handleDone, TIMEOUT);
  });

  afterEach(() => {
    Date.now = dateNow;
  });

  it("should not begin countdown until started", () => {
    advanceByTime(TIMEOUT);
    expect(handleDone).not.toHaveBeenCalled();
  });

  describe("when started", () => {
    beforeEach(() => {
      t.start();
    });

    it("should begin countdown when started", () => {
      advanceByTime(TIMEOUT / 2);
      expect(handleDone).not.toHaveBeenCalled();
      advanceByTime(TIMEOUT / 2);

      expect(handleDone).toHaveBeenCalled();
    });

    it("should allow pausing", () => {
      t.pause();
      advanceByTime(TIMEOUT);

      expect(handleDone).not.toHaveBeenCalled();
    });

    it("should update remaining time on pause", () => {
      advanceByTime(TIMEOUT / 2);
      t.pause();
      t.resume();
      advanceByTime(TIMEOUT / 2);

      expect(handleDone).toHaveBeenCalled();
    });

    it("should allow resuming", () => {
      t.pause();
      advanceByTime(TIMEOUT);
      expect(handleDone).not.toHaveBeenCalled();

      t.resume();
      advanceByTime(TIMEOUT);
      expect(handleDone).toHaveBeenCalled();
    });

    it("should allow stopping", () => {
      t.stop();
      advanceByTime(TIMEOUT);
      expect(handleDone).not.toHaveBeenCalled();

      t.start();
      advanceByTime(TIMEOUT);
      expect(handleDone).toHaveBeenCalled();
    });
  });

  describe("states", () => {
    describe("when stopped", () => {
      it("should not allow pausing", () => {
        t.pause();
        expect(t.state()).toBe("stopped");
      });

      it("should not allow resuming", () => {
        t.resume();
        expect(t.state()).toBe("stopped");
      });

      it("should allowing starting", () => {
        t.start();
        expect(t.state()).toBe("started");
      });
    });

    describe("when started", () => {
      beforeEach(() => {
        t.start();
      });

      it("should allow pausing", () => {
        t.pause();
        expect(t.state()).toBe("paused");
      });

      it("should allow stopping", () => {
        t.stop();
        expect(t.state()).toBe("stopped");
      });

      it("should not allow resuming", () => {
        t.resume();
        expect(t.state()).toBe("started");
      });

      it("should allow completion", () => {
        t.start();
        advanceByTime(TIMEOUT);
        expect(t.state()).toBe("completed");
      });
    });

    describe("when paused", () => {
      beforeEach(() => {
        t.start();
        t.pause();
      });

      it("should allow stopping", () => {
        t.stop();
        expect(t.state()).toBe("stopped");
      });

      it("should allow resuming", () => {
        t.resume();
        expect(t.state()).toBe("started");
      });

      it("should not allow completion", () => {
        advanceByTime(TIMEOUT);
        expect(t.state()).toBe("paused");
      });
    });

    describe("completed", () => {
      beforeEach(() => {
        t.start();
        advanceByTime(TIMEOUT);
      });

      it("should allow starting", () => {
        expect(t.state()).toBe("completed");
        t.start();
        expect(t.state()).toBe("started");
      });

      it("should not allow other actions", () => {
        t.resume();
        expect(t.state()).toBe("completed");
        t.stop();
        expect(t.state()).toBe("completed");
        t.pause();
        expect(t.state()).toBe("completed");
      });
    });
  });
});
