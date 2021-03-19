import {
  useCreateFolderMutation,
  useCreateFolder,
  useCreatePageWithFolder,
} from "./useCreateFolder";

import { useRedirectToPage, useRedirectToFolder } from "hooks/useRedirects";

jest.mock("hooks/useRedirects", () => ({
  useRedirectToPage: jest.fn(),
  useRedirectToFolder: jest.fn(),
}));

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [
    jest.fn(
      () =>
        new Promise((resolve) =>
          resolve({
            data: {
              createFolder: { id: "new-folder", pages: [{ id: "page-1" }] },
            },
          })
        )
    ),
  ],
}));

describe("hooks: useCreateFolder", () => {
  describe("useCreateFolderMutation", () => {
    it("should call callback on completion", async () => {
      const callback = jest.fn();
      const mutation = useCreateFolderMutation();
      await mutation({}, callback);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("useCreateFolder", () => {
    it("should redirect to new folder on completion", async () => {
      const redirect = jest.fn();
      useRedirectToFolder.mockImplementation(() => redirect);

      const addFolder = useCreateFolder();
      await addFolder({});
      expect(redirect).toHaveBeenCalledWith(
        expect.objectContaining({ folderId: "new-folder" })
      );
    });
  });

  describe("useCreatePageWithFolder", () => {
    it("should redirect to new page on completion", async () => {
      const redirect = jest.fn();
      useRedirectToPage.mockImplementation(() => redirect);

      const addFolder = useCreatePageWithFolder();
      await addFolder({});
      expect(redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pageId: "page-1" })
      );
    });
  });
});
