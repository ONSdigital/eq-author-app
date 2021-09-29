const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");

module.exports = (ctx, section, removedPage, pages) => {
  let answerArray = [];

  if (removedPage.answers) {
    removedPage.answers.forEach((answer) => {
      answerArray.push({ id: answer.id, title: answer.label });
      onAnswerDeleted(ctx, removedPage, answer, pages);
    });
  }

  return pages;
};

// if (pages) {
//   pages.forEach((page) => {
//     const { title, description } = page;
//     console.log(`title`, title);

//     if (title.includes(removedPage.id)) {
//       console.log(`HERE!`);

//       page.title = page.title.replace(
//         removedPage.answers[0].label,
//         "Deleted metadata"
//       );
//     }
//     if (description.includes(removedPage.id)) {
//       page.description = page.description.replace(
//         removedPage.answers[0].label,
//         "Deleted metadata"
//       );
//     }
//   });
//   return pages;
// }
