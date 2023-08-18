import { useMutation } from "@apollo/react-hooks";
import { useRedirectToPage, useRedirectToFolder } from "hooks/useRedirects";

import CREATE_FOLDER_MUTATION from "graphql/createFolder.graphql";
import CREATE_LIST_COLLECTOR_FOLDER_MUTATION from "graphql/createListCollectorFolder.graphql";

export const useCreateFolderMutation = () => {
  const [onAddFolder] = useMutation(CREATE_FOLDER_MUTATION);
  return (input, callback) =>
    onAddFolder({
      variables: { input },
    }).then(({ data: { createFolder } }) => callback(createFolder));
};

export const useCreateListCollectorFolderMutation = () => {
  const [onAddListCollectorFolder] = useMutation(
    CREATE_LIST_COLLECTOR_FOLDER_MUTATION,
    { refetchQueries: ["GetQuestionnaire"] }
  );

  return (input, callback) =>
    onAddListCollectorFolder({
      variables: { input },
    }).then(({ data: { createListCollectorFolder } }) =>
      callback(createListCollectorFolder)
    );
};

export const useCreateFolder = () => {
  const redirectToFolder = useRedirectToFolder();
  const createFolder = useCreateFolderMutation();
  return (input) =>
    createFolder(input, (newFolder) =>
      redirectToFolder({ folderId: newFolder.id })
    );
};

export const useCreatePageWithFolder = () => {
  const redirectToPage = useRedirectToPage();
  const createFolder = useCreateFolderMutation();
  return (input) =>
    createFolder(input, (newFolder) =>
      redirectToPage({ pageId: newFolder.pages[0].id })
    );
};

export const useCreateListCollectorFolder = () => {
  const redirectToFolder = useRedirectToFolder();
  const createListCollectorFolder = useCreateListCollectorFolderMutation();

  return (input) =>
    createListCollectorFolder(input, (newListCollectorFolder) =>
      redirectToFolder({ folderId: newListCollectorFolder.id })
    );
};
