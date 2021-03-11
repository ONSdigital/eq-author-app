import { buildFolderPath } from "utils/UrlUtils";

export default ({ id }, history, questionnaireId) =>
  history.push(
    buildFolderPath({
      questionnaireId: questionnaireId,
      folderId: id,
      tab: "design",
    })
  );
