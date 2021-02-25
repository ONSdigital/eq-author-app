import { useMutation } from "@apollo/react-hooks";
import { useRedirectToPage, useRedirectToFolder } from "hooks/useRedirects";

import CREATE_FOLDER_MUTATION from "graphql/createFolder.graphql";

const useCreateFolderMutation = () => {
  const [onAddFolder] = useMutation(CREATE_FOLDER_MUTATION);
  return (input, callback) =>
    onAddFolder({
      variables: { input },
    }).then(({ data: { createFolder } }) => callback(createFolder));
};

export const useCreateFolder = () => {
  const redirectToFolder = useRedirectToFolder();
  const createFolder = useCreateFolderMutation();
  return (input) =>
    createFolder(input, (newFolder) => redirectToFolder(newFolder.id));
};

export const useCreatePageWithFolder = () => {
  const redirectToPage = useRedirectToPage();
  const createFolder = useCreateFolderMutation();
  return (input) =>
    createFolder(input, (newFolder) => redirectToPage(newFolder.pages[0].id));
};
