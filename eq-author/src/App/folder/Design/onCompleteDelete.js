import { buildPagePath, buildSectionPath } from "utils/UrlUtils";

export const onCompleteDelete = (
  response,
  history,
  questionnaireId,
  sectionId,
  folderPosition
) => {
  const sections = response.deleteFolder.sections;
  const sectionIndex = sections.findIndex(
    (sections) => sections.id === sectionId
  );
  const pages = sections[sectionIndex].folders.flatMap(({ pages }) => pages);
  console.log("pages", pages);
  console.log("folderPosition", folderPosition);

  const newPageCreated = pages.length === 1;
  console.log("newPageCreated", newPageCreated);

  const previousPage = pages[folderPosition - 1];

  // const buildPath =
  // folderPosition === 0
  //   ? buildSectionPath({
  //       questionnaireId: questionnaireId,
  //       sectionId: sectionId,
  //     })
  //   : buildPagePath({
  //       questionnaireId: questionnaireId,
  //       pageId: previousPage.id,
  //     });

  const buildPath = buildPagePath({
    questionnaireId: questionnaireId,
    pageId: folderPosition === 0 ? pages[0].id : previousPage.id,
    // pageId: newPageCreated ? pages[0].id : previousPage.id,
  });

  history.push(buildPath);
};

export default onCompleteDelete;
