import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { render, fireEvent } from "tests/utils/rtl";

import { useCreateQuestionPage } from "hooks/useCreateQuestionPage";
import { useCreatePageWithFolder } from "hooks/useCreateFolder";
import { useSetNavigationCallbacks } from "components/NavigationCallbacks";

import FolderDesignPage from "./";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

const mockQuestionnaire = buildQuestionnaire({ folderCount: 2 });
const firstFolder = mockQuestionnaire.sections[0].folders[0];

const mockUseMe = { me: { id: "user-1" } };

jest.mock("react-apollo", () => ({
  useSubscription: () => null,
}));

jest.mock("@apollo/react-hooks", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(() => [() => null]),
}));

jest.mock("hooks/useCreateQuestionPage", () => ({
  useCreateQuestionPage: jest.fn(),
  useCreateCalculatedSummaryPage: jest.fn(),
  useCreateListCollectorPage: jest.fn(),
}));

jest.mock("hooks/useCreateFolder", () => ({
  useCreateFolder: jest.fn(),
  useCreatePageWithFolder: jest.fn(),
  useCreateListCollectorFolder: jest.fn(),
}));

jest.mock("components/NavigationCallbacks", () => ({
  useSetNavigationCallbacks: jest.fn(),
}));

jest.mock("App/MeContext", () => ({
  useMe: () => mockUseMe,
}));

const mockData = {
  folder: {
    id: firstFolder.id,
    alias: firstFolder.alias,
    position: 0,
    pages: [
      {
        id: firstFolder.pages[0].id,
        __typename: "Page",
      },
    ],
    section: {
      id: mockQuestionnaire.sections[0].id,
      __typename: "Section",
    },
    validationErrorInfo: {
      totalCount: 0,
      errors: [],
      id: "210dc30a-683c-43bc-a29e-70c6d15d677c",
      __typename: "ValidationErrorInfo",
    },
    __typename: "Folder",
  },
};

useQuery.mockImplementation(() => ({
  loading: false,
  error: false,
  data: mockData,
}));

const secondFolder = mockQuestionnaire.sections[0].folders[1];

const renderFolderDesignPage = ({
  match = {
    params: {
      folderId: firstFolder.id,
      questionnaireId: mockQuestionnaire.id,
    },
  },
  history = { push: jest.fn() },
} = {}) =>
  render(<FolderDesignPage match={match} history={history} />, {
    route: `/q/${mockQuestionnaire.id}/folder/${secondFolder.id}/design`,
    urlParamMatcher: "/q/:questionnaireId/folder/:folderId/:tab",
  });

describe("Folder design page", () => {
  describe("Folder design page", () => {
    it("Should render", () => {
      const { getByTestId } = renderFolderDesignPage();
      expect(getByTestId("folders-page")).toBeVisible();
    });

    it("Should show the error page if there is an error getting the folder from db", () => {
      useQuery.mockImplementationOnce(() => ({
        loading: false,
        error: true,
        data: undefined,
      }));
      const { getByTestId } = renderFolderDesignPage();

      expect(getByTestId("error")).toBeVisible();
      expect(() => getByTestId("folders-page")).toThrow();
    });

    it("Should show the error page if no folder is returned from the db", () => {
      useQuery.mockImplementationOnce(() => ({
        loading: false,
        error: false,
        data: undefined,
      }));
      const { getByTestId } = renderFolderDesignPage();

      expect(getByTestId("error")).toBeVisible();
      expect(() => getByTestId("folders-page")).toThrow();
    });

    it("Show show the loading page if the get folder query is in flight", () => {
      useQuery.mockImplementationOnce(() => ({
        loading: true,
        error: undefined,
        data: undefined,
      }));
      const { getByTestId } = renderFolderDesignPage({});

      expect(getByTestId("loading")).toBeVisible();
      expect(() => getByTestId("folders-page")).toThrow();
    });

    it("Should trigger a delete modal", () => {
      const { getByTestId } = renderFolderDesignPage();

      fireEvent.click(getByTestId("btn-delete-folder"));

      expect(getByTestId("modal")).toBeVisible();
    });

    it("should delete a folder when the delete button is clicked", () => {
      const deleteFolder = jest.fn();
      useMutation.mockImplementation(jest.fn(() => [deleteFolder]));
      const { getByTestId } = renderFolderDesignPage();

      fireEvent.click(getByTestId("btn-delete-folder"));
      fireEvent.click(getByTestId("btn-modal-positive"));

      expect(deleteFolder).toHaveBeenCalledWith({
        variables: { input: { id: "1.1" } },
      });
    });

    it("should close delete modal when cancel button is clicked", () => {
      const deleteFolder = jest.fn();
      useMutation.mockImplementation(jest.fn(() => [deleteFolder]));
      const { getByTestId, queryByTestId } = renderFolderDesignPage();

      fireEvent.click(getByTestId("btn-delete-folder"));
      fireEvent.click(getByTestId("btn-modal-negative"));

      expect(deleteFolder).not.toHaveBeenCalled();
      expect(queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("Should add question page inside folder", () => {
      const onAddQuestionPage = jest.fn();
      useCreateQuestionPage.mockImplementation(() => onAddQuestionPage);

      const { getByTestId } = renderFolderDesignPage();

      fireEvent.click(getByTestId("btn-add-page-inside-folder"));
      expect(onAddQuestionPage).toHaveBeenCalledWith({
        folderId: "1.1",
        position: 0,
      });
    });

    it("Should add question page outside folder", () => {
      const addPageWithFolder = jest.fn();
      useCreatePageWithFolder.mockImplementation(() => addPageWithFolder);

      const { getByTestId } = renderFolderDesignPage();

      fireEvent.click(getByTestId("btn-add-page-outside-folder"));
      expect(addPageWithFolder).toHaveBeenCalledWith({
        sectionId: "1",
        position: 1,
      });
    });

    it("should call setNavigation with functions and dependencies", () => {
      const callbacks = jest.fn();
      useSetNavigationCallbacks.mockImplementationOnce(callbacks);
      renderFolderDesignPage();
      expect(callbacks).toHaveBeenCalledWith(
        {
          onAddQuestionPage: expect.any(Function),
          onAddCalculatedSummaryPage: expect.any(Function),
          onAddListCollectorFolder: expect.any(Function),
          onAddFolder: expect.any(Function),
        },
        [
          expect.objectContaining({
            alias: "Folder 1.1",
            id: "1.1",
            position: 0,
          }),
        ]
      );
    });

    it("should duplicate a folder when duplicate button is clicked", () => {
      const duplicateFolder = jest.fn();
      useMutation.mockImplementation(jest.fn(() => [duplicateFolder]));

      const { getByTestId } = renderFolderDesignPage();

      fireEvent.click(getByTestId("btn-duplicate-folder"));
      expect(duplicateFolder).toHaveBeenCalledWith({
        variables: { input: { id: "1.1", position: 1 } },
      });
    });
  });
});
