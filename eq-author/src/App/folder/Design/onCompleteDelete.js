import { buildPagePath } from "utils/UrlUtils";

export default ({ folders }, history, questionnaireId, folderPosition) => {
  const pages = folders.flatMap(({ pages }) => pages);
  const previousPage = pages[folderPosition - 1];

  const buildPath = buildPagePath({
    questionnaireId: questionnaireId,
    pageId: folderPosition === 0 ? pages[0].id : previousPage.id,
  });

  history.push(buildPath);
};
