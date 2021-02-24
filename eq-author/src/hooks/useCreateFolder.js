import { useMutation } from "@apollo/react-hooks";
import { useParams, useHistory } from "react-router-dom";
import { buildFolderPath, buildPagePath } from "utils/UrlUtils";

import CREATE_FOLDER_MUTATION from "graphql/createFolder.graphql";

export const redirectToNewFolder = ({ id }, params, history) => {
  return history.push(
    buildFolderPath({
      questionnaireId: params.questionnaireId,
      folderId: id,
    })
  );
};

export const redirectToNewPage = ({ pages, section }, params, history) =>
  history.push(
    buildPagePath({
      questionnaireId: params.questionnaireId,
      sectionId: section.id,
      pageId: pages[0].id,
    })
  );

export const useCreateFolder = () => {
  const params = useParams();
  const history = useHistory();
  const [onAddFolder] = useMutation(CREATE_FOLDER_MUTATION, {
    onCompleted: ({ createFolder }) =>
      redirectToNewFolder(createFolder, params, history),
  });

  const [onAddFolderAndPage] = useMutation(CREATE_FOLDER_MUTATION, {
    onCompleted: ({ createFolder }) =>
      redirectToNewPage(createFolder, params, history),
  });

  const addFolder = (input) => onAddFolder({ variables: { input } });

  const addFolderAndPage = (input) =>
    onAddFolderAndPage({ variables: { input } });

  return [addFolder, addFolderAndPage];
};
