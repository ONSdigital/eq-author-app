import React from "react";

import { render, act, flushPromises } from "tests/utils/rtl";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import { MeContext } from "App/MeContext";
import QuestionnaireContext from "components/QuestionnaireContext";

import { publishStatusSubscription } from "components/EditorLayout/Header";
import GET_FOLDER_QUERY from "./getFolderQuery.graphql";

import FolderDesignPage from "./";

const mockQuestionnaire = buildQuestionnaire();

const firstFolder = mockQuestionnaire.sections[0].folders[0];

const mockUser = {
  id: "123",
  displayName: "Raymond Holt",
  email: "RaymondHolt@TheNineNine.com",
  picture: "http://img.com/avatar.jpg",
  admin: true,
};

let mocks;

const renderFolderDesignPage = ({
  match = {
    params: { folderId: firstFolder.id },
  },
}) =>
  render(
    <MeContext.Provider value={{ me: mockUser, signOut: jest.fn() }}>
      <QuestionnaireContext.Provider
        value={{ questionnaire: mockQuestionnaire }}
      >
        <FolderDesignPage match={match} />
      </QuestionnaireContext.Provider>
    </MeContext.Provider>,
    {
      route: `/q/${mockQuestionnaire.id}/folder/${firstFolder.id}/design`,
      urlParamMatcher: "/q/:questionnaireId/folder/:folderId/:tab",
      mocks,
    }
  );

describe("Folder design page", () => {
  beforeEach(() => {
    mocks = [
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: mockQuestionnaire.id },
        },
        result: () => ({
          data: {
            publishStatusUpdated: {
              id: mockQuestionnaire.id,
              publishStatus: "Unpublished",
              __typename: "Questionnaire",
            },
          },
        }),
      },
      {
        request: {
          query: GET_FOLDER_QUERY,
          variables: { input: { folderId: firstFolder.id } },
        },
        result: () => ({
          data: {
            folder: {
              id: firstFolder.id,
              alias: firstFolder.alias,
              __typename: "Folder",
            },
          },
        }),
      },
    ];
  });

  it("Can render", async () => {
    const { getByTestId } = renderFolderDesignPage({});

    await act(async () => {
      await flushPromises();
    });

    expect(getByTestId("folders-page")).toBeVisible();
  });

  it("Should show the error page if there is an error getting the folder from db", async () => {
    const { getByTestId } = renderFolderDesignPage({
      match: { params: { folderId: "10" } },
    });

    await act(async () => {
      await flushPromises();
    });

    expect(getByTestId("error")).toBeVisible();
    expect(() => getByTestId("folders-page")).toThrow();
  });

  it("Should show the error page if no folder is returned from the db", async () => {
    mocks[1].result = () => ({});
    const { getByTestId } = renderFolderDesignPage({});

    await act(async () => {
      await flushPromises();
    });

    expect(getByTestId("error")).toBeVisible();
    expect(() => getByTestId("folders-page")).toThrow();
  });

  it("Show show the loading page if the get folder query is in flight", () => {
    const { getByTestId } = renderFolderDesignPage({});

    expect(getByTestId("loading")).toBeVisible();
    expect(() => getByTestId("folders-page")).toThrow();
  });
});
