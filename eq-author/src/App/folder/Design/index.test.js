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
import DELETE_FOLDER_MUTATION from "./deleteFolder.graphql";

import FolderDesignPage from "./";

const mockQuestionnaire = buildQuestionnaire({
  folderCount: 2,
});

const secondFolder = mockQuestionnaire.sections[0].folders[1];

const mockUser = {
  id: "123",
  displayName: "Raymond Holt",
  email: "RaymondHolt@TheNineNine.com",
  picture: "http://img.com/avatar.jpg",
  admin: true,
};

let mocks, deleteWasCalled, duplicateWasCalled;

const renderFolderDesignPage = ({
  match = {
    params: {
      folderId: secondFolder.id,
      questionnaireId: mockQuestionnaire.id,
    },
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
      route: `/q/${mockQuestionnaire.id}/folder/${secondFolder.id}/design`,
      urlParamMatcher: "/q/:questionnaireId/folder/:folderId/:tab",
      mocks,
    }
  );

describe("Folder design page", () => {
  beforeEach(() => {
    duplicateWasCalled = false;
    deleteWasCalled = false;
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
          variables: { input: { folderId: secondFolder.id } },
        },
        result: () => ({
          data: {
            folder: {
              id: secondFolder.id,
              alias: secondFolder.alias,
              position: secondFolder.position,
              pages: [
                {
                  id: secondFolder.pages[0].id,
                  __typename: "QuestionPage",
                },
              ],
              section: {
                id: secondFolder.section.id,
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
            input: { id: secondFolder.id, position: secondFolder.position + 1 },
          },
        },
        result: () => {
          duplicateWasCalled = true;
          return {
            data: {
              duplicateFolder: {
                ...secondFolder,
                position: secondFolder.position,
                id: secondFolder.id,
                section: [
                  {
                    id: secondFolder.section.id,
                    folders: [
                      {
                        id: secondFolder.id,
                        alias: "",
                        enabled: false,
                        position: 0,
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
      {
        request: {
          query: DELETE_FOLDER_MUTATION,
          variables: { input: { id: secondFolder.id } },
        },
        result: () => {
          deleteWasCalled = true;
          return {
            data: {
              deleteFolder: {
                id: "2",
                position: 0,
                folders: [
                  {
                    id: "1.1",
                    alias: "",
                    enabled: false,
                    position: 0,
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

  it("Show the loading page if the get folder query is in flight", () => {
    const { getByTestId } = renderFolderDesignPage({});

    expect(getByTestId("loading")).toBeVisible();
    expect(() => getByTestId("folders-page")).toThrow();
  });

  it("Should trigger a delete modal", async () => {
    const { getByTestId, getByTitle } = renderFolderDesignPage({});

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      await fireEvent.click(getByTitle("Delete"));
    });

    expect(getByTestId("delete-confirm-modal")).toBeVisible();
  });

  it("Should delete a folder", async () => {
    const { getByTestId, getByTitle } = renderFolderDesignPage({});

    await act(async () => {
      await flushPromises();
    });

    await act(async () => {
      await fireEvent.click(getByTitle("Delete"));
    });

    await act(async () => {
      await fireEvent.click(getByTestId("btn-delete-modal"));
    });

    await act(async () => {
      await flushPromises();
    });
    expect(deleteWasCalled).toBeTruthy();
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
