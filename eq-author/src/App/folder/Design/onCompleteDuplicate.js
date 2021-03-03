import { buildFolderPath } from "utils/UrlUtils";

const onCompleteDuplicate = (response, history, questionnaireId) => {
  const { id } = response.duplicateFolder;

  const buildPath = buildFolderPath({
    questionnaireId: questionnaireId,
    folderId: id,
    tab: "design",
  });

  history.push(buildPath);
};

export default onCompleteDuplicate;
