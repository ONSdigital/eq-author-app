//Credit https://stackoverflow.com/a/38340374

/* Removes undefined object keys */

const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object") {
      removeEmpty(obj[key]);
    } else if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};

module.exports = { removeEmpty };
