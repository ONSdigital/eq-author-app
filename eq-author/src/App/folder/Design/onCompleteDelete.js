import { buildPagePath } from "utils/UrlUtils";

export const onCompleteDelete = (
  response,
  history,
  questionnaireId,
  folderPosition
) => {
  const section = response.deleteFolder;
  const pages = section.folders.flatMap(({ pages }) => pages);
  const previousPage = pages[folderPosition - 1];

  const buildPath = buildPagePath({
    questionnaireId: questionnaireId,
    pageId: folderPosition === 0 ? pages[0].id : previousPage.id,
  });

  history.push(buildPath);
};

export default onCompleteDelete;
