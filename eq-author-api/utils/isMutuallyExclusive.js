module.exports = (mutuallyExclusiveFields) => (object) => {
  const applicableFields = Object.keys(object).filter((key) =>
    mutuallyExclusiveFields.includes(key)
  );
  return applicableFields.length === 1;
};
