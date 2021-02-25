import { useParams, useHistory } from "react-router-dom";
import { buildFolderPath, buildPagePath } from "utils/UrlUtils";

export const useRedirectToPage = () => {
  const history = useHistory();
  const { questionnaireId } = useParams();

  return (pageId) => history.push(buildPagePath({ questionnaireId, pageId }));
};

export const useRedirectToFolder = () => {
  const history = useHistory();
  const { questionnaireId } = useParams();

  return (folderId) =>
    history.push(buildFolderPath({ questionnaireId, folderId }));
};
