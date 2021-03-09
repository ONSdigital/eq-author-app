import React from "react";

import {
  render,
  act,
  flushPromises,
  waitFor,
  fireEvent,
} from "tests/utils/rtl";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import { MeContext } from "App/MeContext";
import QuestionnaireContext from "components/QuestionnaireContext";

import { publishStatusSubscription } from "components/EditorLayout/Header";
import GET_FOLDER_QUERY from "./getFolderQuery.graphql";
import DUPLICATE_FOLDER_MUTATION from "graphql/duplicateFolder.graphql";

import FolderDesignPage from "./";

const mockQuestionnaire = buildQuestionnaire();
console.log(JSON.stringify(mockQuestionnaire, null, 7));

const firstFolder = mockQuestionnaire.sections[0].folders[0];

const mockUser = {
  id: "123",
  displayName: "Raymond Holt",
  email: "RaymondHolt@TheNineNine.com",
  picture: "http://img.com/avatar.jpg",
  admin: true,
};

let mocks, duplicateWasCalled;

const renderFolderDesignPage = ({
  match = {
    params: { folderId: firstFolder.id, questionnaireId: mockQuestionnaire.id },
  },
  history = { push: jest.fn() },
}) =>
  render(
    <MeContext.Provider value={{ me: mockUser, signOut: jest.fn() }}>
      <QuestionnaireContext.Provider
        value={{ questionnaire: mockQuestionnaire }}
      >
        <FolderDesignPage match={match} history={history} />
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
    duplicateWasCalled = false;
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
              position: firstFolder.position,
              pages: [
                {
                  id: firstFolder.pages[0].id,
                  __typename: "QuestionPage",
                },
              ],
              section: {
                id: firstFolder.section.id,
                __typename: "Section",
              },
              __typename: "Folder",
            },
          },
        }),
      },
      {
        request: {
          query: DUPLICATE_FOLDER_MUTATION,
          variables: {
            input: { id: firstFolder.id, position: firstFolder.position + 1 },
          },
        },
        result: () => {
          duplicateWasCalled = true;
          return {
            data: {
              duplicateFolder: {
                ...firstFolder,
                position: firstFolder.position,
                id: firstFolder.id,
                section: [
                  {
                    id: firstFolder.section.id,
                    folders: [
                      {
                        id: firstFolder.id,
                        pages: [
                          {
                            id: "1.1.1",
                            title: "Page 1.1.1",
                            displayName: "Page 1.1.1",
                            alias: "1.1.1",
                            position: 0,
                            validationErrorInfo: {
                              totalCount: 0,
                              errors: [],
                              id: "210dc30a-683c-43bc-a29e-70c6d15d677c",
                              __typename: "ValidationErrorInfo",
                            },
                            section: {
                              id: "1",
                            },
                            folder: {
                              id: "1",
                            },
                            additionalInfoContent: null,
                            additionalInfoEnabled: false,
                            additionalInfoLabel: null,
                            confirmation: null,
                            definitionContent: null,
                            definitionEnabled: false,
                            definitionLabel: null,
                            description: "",
                            descriptionEnabled: false,
                            guidance: null,
                            guidanceEnabled: false,
                            pageType: "QuestionPage",
                            answers: [
                              {
                                id: "1872f8af-2000-4af2-953e-144d264769e0",
                                description: "",
                                guidance: "",
                                label: "Test",
                                decimals: 0,
                                properties: { required: false, decimals: 0 },
                                required: false,
                                qCode: "",
                                secondaryLabel: null,
                                secondaryLabelDefault: "Untitled answer",
                                secondaryQCode: null,
                                type: "Number",
                                displayName: "",
                                options: {
                                  id: "",
                                  displayName: "",
                                  label: "",
                                  description: "",
                                  value: "",
                                  qCode: "",
                                  __typename: "options",
                                },
                                mutuallyExclusiveOption: {
                                  id: "",
                                  label: "",
                                  qCode: "",
                                  __typename: "mutuallyExclusiveOption",
                                },
                                __typename: "BasicAnswer",
                              },
                            ],
                            __typename: "QuestionPage",
                          },
                        ],
                        __typename: "Folder",
                      },
                    ],
                    __typename: "Section",
                  },
                ],
                __typename: "Folder",
              },
            },
          };
        },
      },
    ];
  });

  it("Can render", async () => {
    const { getByTestId } = renderFolderDesignPage({});

    await waitFor(() => expect(getByTestId("folders-page")).toBeVisible());
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

  it("Should duplicate a folder when duplicate button is clicked", async () => {
    const { getByTestId } = renderFolderDesignPage({});

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      fireEvent.click(getByTestId("btn-duplicate-folder"));
    });

    await act(async () => {
      await flushPromises();
    });

    expect(duplicateWasCalled).toBeTruthy();
  });
});
