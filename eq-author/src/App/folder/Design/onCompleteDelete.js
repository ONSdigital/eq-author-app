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

  const buildPath =
    folderPosition === 0
      ? buildSectionPath({
          questionnaireId: questionnaireId,
          sectionId: sectionId,
        })
      : buildPagePath({
          questionnaireId: questionnaireId,
          pageId: previousPage.id,
        });

  history.push(buildPath);
};

export default onCompleteDelete;
