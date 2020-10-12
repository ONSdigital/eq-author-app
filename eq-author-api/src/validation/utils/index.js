const getPath = path => {
  if (typeof path !== "string") {
    throw new Error("Path needs to be a string");
  }
  const dataPath = path.slice(1).split("/");

  const current = {};
  for (let i = 0; i < dataPath.length; i++) {
    if (dataPath.length % 2 !== 0) {
      current.field = dataPath[dataPath.length - 1];
    }
    if (!isNaN(dataPath[i])) {
      current[dataPath[i - 1]] = dataPath[i];
    }
  }

  return current;
};

module.exports = {
  getPath,
};
