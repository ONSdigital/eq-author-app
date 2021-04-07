module.exports = {
  NOTICE_1:
    "Notice is given under section 1 of the Statistics of Trade Act 1947.",
  NOTICE_2:
    "Notice is given under sections 3 and 4 of the Statistics of Trade Act 1947.",
  VOLUNTARY: undefined,
  types: {},
};

Object.keys(module.exports).forEach((key) => (module.exports.types[key] = key));
