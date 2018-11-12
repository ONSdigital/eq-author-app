const generateTestData = (sections = 4, pages = 5, answers = 6) => {
  let answerId = 1;
  let pageId = 1;
  let sectionId = 1;
  let sectionArray = [];
  let pageArray = [];
  let answerArray = [];
  let x, y, z;
  for (x = 0; x < sections; x++) {
    for (y = 0; y < pages; y++) {
      for (z = 0; z < answers; z++) {
        answerArray.push({
          id: `Answer ${answerId}`,
          displayName: `Answer ${answerId}`,
          type: "Currency",
          __typename: "BasicAnswer"
        });
        answerId++;
      }
      pageArray.push({
        id: `Page ${pageId}`,
        displayName: `Page ${pageId}`,
        answers: answerArray,
        __typename: "QuestionPage"
      });
      answerArray = [];
      pageId++;
    }
    sectionArray.push({
      id: `Section ${sectionId}`,
      displayName: `Section ${sectionId}`,
      pages: pageArray,
      __typename: "Section"
    });
    sectionId++;
    pageArray = [];
  }
  return sectionArray;
};
export default generateTestData;
