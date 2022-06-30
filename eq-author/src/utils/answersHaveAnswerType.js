// Returns true if answers includes an answer of the specified answerType
const answersHaveAnswerType = (answers, answerType) => {
  if (answers.some((answer) => answer.type === answerType)) {
    return true;
  } else {
    return false;
  }
};

export default answersHaveAnswerType;
