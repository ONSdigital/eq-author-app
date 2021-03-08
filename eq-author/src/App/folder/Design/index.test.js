import React from "react";
import { render, act, flushPromises, waitFor } from "tests/utils/rtl";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import FolderDesignPage from "./";

import { useQuery } from "@apollo/react-hooks";

const mockQuestionnaire = buildQuestionnaire({ folderCount: 2 });
const firstFolder = mockQuestionnaire.sections[0].folders[0];

jest.mock("react-apollo", () => ({
  useSubscription: () => null,
}));

jest.mock("@apollo/react-hooks", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(() => []),
}));

jest.mock("hooks/useCreateQuestionPage", () => ({
  useCreateQuestionPage: jest.fn(),
  useCreateCalculatedSummaryPage: jest.fn(),
}));

jest.mock("hooks/useCreateFolder", () => ({
  useCreateFolder: jest.fn(),
  useCreatePageWithFolder: jest.fn(),
}));

jest.mock("components/NavigationCallbacks", () => ({
  useSetNavigationCallbacks: () => jest.fn,
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
    __typename: "Folder",
  },
};

const renderFolderDesignPage = ({
  match = {
    params: { folderId: firstFolder.id },
  },
} = {}) =>
  render(<FolderDesignPage match={match} />, {
    route: `/q/${mockQuestionnaire.id}/folder/${firstFolder.id}/design`,
    urlParamMatcher: "/q/:questionnaireId/folder/:folderId/:tab",
  });

describe("Folder design page", () => {
  it("Can render", async () => {
    useQuery.mockImplementation(() => ({
      loading: false,
      error: false,
      data: mockData,
    }));

    const { getByTestId } = renderFolderDesignPage();
    await waitFor(() => expect(getByTestId("folders-page")).toBeVisible());
  });

  it("Should show the error page if there is an error getting the folder from db", async () => {
    useQuery.mockImplementation(() => ({
      loading: false,
      error: true,
      data: undefined,
    }));
    const { getByTestId } = renderFolderDesignPage();

    expect(getByTestId("error")).toBeVisible();
    expect(() => getByTestId("folders-page")).toThrow();
  });

  it("Should show the error page if no folder is returned from the db", async () => {
    useQuery.mockImplementation(() => ({
      loading: false,
      error: false,
      data: undefined,
    }));
    const { getByTestId } = renderFolderDesignPage({});

    await act(async () => {
      await flushPromises();
    });

    expect(getByTestId("error")).toBeVisible();
    expect(() => getByTestId("folders-page")).toThrow();
  });

  it("Show show the loading page if the get folder query is in flight", () => {
    useQuery.mockImplementation(() => ({
      loading: true,
      error: undefined,
      data: undefined,
    }));
    const { getByTestId } = renderFolderDesignPage({});

    expect(getByTestId("loading")).toBeVisible();
    expect(() => getByTestId("folders-page")).toThrow();
  });
});
