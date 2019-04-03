const contentMap = {
  NOTICE_1:
    "Notice is given under section 1 of the Statistics of Trade Act 1947.",
  NOTICE_2:
    "Notice is given under sections 3 and 4 of the Statistics of Trade Act 1947.",
  VOLUNTARY: null,
};

module.exports.types = Object.keys(contentMap).reduce(
  (hash, key) => ({
    ...hash,
    [key]: key,
  }),
  {}
);
module.exports.contentMap = contentMap;
