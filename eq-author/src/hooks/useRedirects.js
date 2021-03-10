import { useParams, useHistory } from "react-router-dom";
import { buildFolderPath, buildPagePath } from "utils/UrlUtils";

export const useRedirect = (buildPath) => {
  const history = useHistory();
  const { questionnaireId } = useParams();
  return (target) => history.push(buildPath({ questionnaireId, ...target }));
};

export const useRedirectToPage = () => useRedirect(buildPagePath);
export const useRedirectToFolder = () => useRedirect(buildFolderPath);
