import fsm from "./fsm";

const states = {
  stopped: {
    start: "started"
  },
  started: {
    pause: "paused",
    stop: "stopped",
    complete: "completed"
  },
  paused: {
    resume: "started",
    stop: "stopped"
  },
  completed: {
    start: "started"
  }
};

export default function timer(done, ms) {
  let start, timeoutId, remaining;

  const sm = fsm(states, "stopped");

  const complete = () => {
    if (sm.transition("complete")) {
      done();
    }
  };

  return {
    state() {
      return sm.state();
    },

    start() {
      if (sm.transition("start")) {
        remaining = ms;
        start = Date.now();
        timeoutId = setTimeout(complete, remaining);
      }
    },

    stop() {
      if (sm.transition("stop")) {
        clearTimeout(timeoutId);
      }
    },

    pause() {
      if (sm.transition("pause")) {
        remaining -= Date.now() - start;
        clearTimeout(timeoutId);
      }
    },

    resume() {
      if (sm.transition("resume")) {
        timeoutId = setTimeout(complete, remaining);
      }
    }
  };
}
