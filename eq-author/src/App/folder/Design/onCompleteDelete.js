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
  const previousPage = pages[folderPosition - 1];

  const buildPath = buildPagePath({
    questionnaireId: questionnaireId,
    pageId: folderPosition === 0 ? pages[0].id : previousPage.id,
  });

  history.push(buildPath);
};

export default onCompleteDelete;
