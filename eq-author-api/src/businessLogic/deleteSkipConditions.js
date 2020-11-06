module.exports = question => {
    question.skipConditions & delete question.skipConditions;
};