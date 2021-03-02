import { buildPagePath, buildSectionPath } from "utils/UrlUtils";

const onCompleteDuplicate = (
  response,
  history,
  questionnaireId,
  sectionId,
  folderPosition
) => {
  const section = response.duplicateFolder.section;

  const pages = section.folders.flatMap(({ pages }) => pages);

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
