import { buildPagePath, buildSectionPath } from "utils/UrlUtils";

export default (
  { sections },
  history,
  questionnaireId,
  sectionId,
  folderPosition
) => {
  const sectionIndex = sections.findIndex(
    (section) => section.id === sectionId
  );
  const pages = sections[sectionIndex].folders.flatMap(({ pages }) => pages);
  const previousPage = pages[folderPosition - 1];

  const buildPath =
    folderPosition === 0
      ? buildSectionPath({
          questionnaireId,
          sectionId,
        })
      : buildPagePath({
          questionnaireId,
          pageId: previousPage.id,
        });

  history.push(buildPath);
};
