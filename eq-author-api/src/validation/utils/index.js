const getPath = (path) => {
  if (typeof path !== "string") {
    throw new Error("Path needs to be a string");
  }
  const dataPath = path.slice(1).split("/");

  const current = {};

  if (dataPath.length % 2 !== 0) {
    current.field = dataPath[dataPath.length - 1];
  }

  dataPath.forEach((segment, index) => {
    if (!isNaN(segment)) {
      current[dataPath[index - 1]] = segment;
    }
  });

  return current;
};

module.exports = {
  getPath,
};
