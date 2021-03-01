import { buildPagePath, buildSectionPath } from "utils/UrlUtils";

const onCompleteDuplicate = (
  response,
  history,
  questionnaireId,
  sectionId,
  folderPosition
) => {
  const sections = response.duplicateFolder.sections;
  const sectionIndex = sections.findIndex(
    (sections) => sections.id === sectionId
  );

  const pages = sections[sectionIndex].folders.flatMap(({ pages }) => pages);

  const nextPage = pages[folderPosition + 1];

  const buildPath =
    folderPosition === 0
      ? buildSectionPath({
          questionnaireId: questionnaireId,
          sectionId: sectionId,
        })
      : buildPagePath({
          questionnaireId: questionnaireId,
          pageId: nextPage.id,
        });

  history.push(buildPath);
};

export default onCompleteDuplicate;
