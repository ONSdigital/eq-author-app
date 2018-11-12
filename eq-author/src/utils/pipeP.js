const pipeP = (...args) => {
  if (args.length === 0) {
    throw new Error("Expected at least one argument");
  }

  const [initial, ...rest] = args;

  return rest.reduce((a, b) => {
    return function() {
      return Promise.resolve(a.apply(null, arguments)).then(b);
    };
  }, initial);
};

export default pipeP;
