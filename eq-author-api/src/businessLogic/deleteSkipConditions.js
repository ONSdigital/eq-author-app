module.exports = question => {
  if (question.skipConditions) {
    delete question.skipConditions
  };
};