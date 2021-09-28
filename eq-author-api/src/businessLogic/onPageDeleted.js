const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");

module.exports = (ctx, section, removedPage, pages) => {
  let answerArray = [];

  if (removedPage.answers) {
    removedPage.answers.forEach((answer) => {
      answerArray.push({ id: answer.id, title: answer.label });
      onAnswerDeleted(ctx, removedPage, answer);
    });
  }
  console.log(`answerArray`, answerArray);

  console.log(`pages`, JSON.stringify(pages, null, 7));
  console.log(`removedPage`, JSON.stringify(removedPage, null, 7));
  console.log(`removedPage.answers[0].label`, removedPage.answers[0].label);
  console.log(`removedPage.id`, removedPage.id);

  //remove the removedPage here first

  pages.map((page) => {
    console.log(`page.title`, page.title);
    if (page?.title?.includes('data-piped="answers"')) {
      console.log(`HERE`);
      // const splitTitleToArray = page.title.split(/(?<=\/span)/);

      // splitTitleToArray.map((titlePart) => {
      //   const idExists = regexp.exec(titlePart);

      //   if (idExists !== null && titlePart.includes("metadata")) {
      //     const index = splitTitleToArray.indexOf(titlePart);

      //     const titleMetadataId = idExists[0];
      //     if (
      //       !metadata.some(
      //         (thisMetaData) => thisMetaData.id === titleMetadataId
      //       )
      //     ) {
      //       titlePart = titlePart.replace(/\[.*?\]/, "[Deleted metadata]");
      //       splitTitleToArray[index] = titlePart;
      //     }
      //   }
      // });
      // page.title = splitTitleToArray.join("");
    }

    // if (page?.description?.includes("metadata")) {
    //   const splitdescriptionToArray = page.description.split(/(?<=\/span)/);

    //   splitdescriptionToArray.map((titlePart) => {
    //     const idExists = regexp.exec(titlePart);

    //     if (idExists !== null && titlePart.includes("metadata")) {
    //       const index = splitdescriptionToArray.indexOf(titlePart);
    //       const titleMetadataId = idExists[0];
    //       if (
    //         !metadata.some(
    //           (thisMetaData) => thisMetaData.id === titleMetadataId
    //         )
    //       ) {
    //         titlePart = titlePart.replace(/\[.*?\]/, "[Deleted metadata]");
    //         splitdescriptionToArray[index] = titlePart;
    //       }
    //     }
    //   });
    //   page.description = splitdescriptionToArray.join("");
    // }
  });

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
