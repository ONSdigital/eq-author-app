// Returns true if answers includes an answer of the specified answerType
const answersHaveAnswerType = (answers, answerType) => {
  console.log("test");
  console.log("test2");
  console.log("test3");
  console.log("test4");

  if (answers.some((answer) => answer.type === answerType)) {
    return true;
  } else {
    return false;
  }
};

export default answersHaveAnswerType;
