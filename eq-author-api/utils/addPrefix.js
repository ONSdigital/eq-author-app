const { replace, isEmpty, isNil } = require("lodash");

const fn = group => (isNil(group) ? "" : group);

module.exports = (value, prefix = "Copy of ") => {
  if (isNil(value) || isEmpty(value)) {
    return "";
  }

  return replace(value, /(<\w+>)?([^<]*)(<\/\w+>)?/, (_, a, b, c) => {
    return isEmpty(b)
      ? `${fn(a)}${b}${fn(c)}`
      : `${fn(a)}${prefix}${b}${fn(c)}`;
  });
};
