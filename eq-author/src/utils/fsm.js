export default function fsm(states, initial = "initial") {
  let current = initial;

  if (!states.hasOwnProperty(initial)) {
    throw new Error(`No initial state '${initial}' in states`);
  }

  return {
    state() {
      return current;
    },

    transition(action) {
      const next = states[current][action];
      if (next) {
        return (current = next);
      }
    }
  };
}
