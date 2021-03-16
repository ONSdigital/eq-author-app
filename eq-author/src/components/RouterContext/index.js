import { useParams } from "react-router-dom";

export const useCurrentPageId = () => {
  const params = useParams();
  return (
    params.pageId ||
    params.confirmationId ||
    params.folderId ||
    params.sectionId ||
    params.introductionId
  );
};
