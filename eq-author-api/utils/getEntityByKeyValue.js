const { map, isArray, isObject, mapValues } = require("lodash");

const getEntityByKeyValue = (obj, valToMatch, key = "id", list = []) => {
  if (isArray(obj)) {
    map(obj, (innerObj) =>
      getEntityByKeyValue(innerObj, valToMatch, key, list)
    );
  } else if (isObject(obj)) {
    if (obj[key] === valToMatch) {
      list.push(obj);
    }
    mapValues(obj, (val) => getEntityByKeyValue(val, valToMatch, key, list));
  }
  return list;
};

module.exports = getEntityByKeyValue;
