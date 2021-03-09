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

const firstFolder = mockQuestionnaire.sections[0].folders[0];

const mockUser = {
  id: "123",
  displayName: "Raymond Holt",
  email: "RaymondHolt@TheNineNine.com",
  picture: "http://img.com/avatar.jpg",
  admin: true,
};

let mocks, response;
let duplicateWasCalled;

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
          variables: { input: { folderId: firstFolder.id } },
        },
        result: () => {
          duplicateWasCalled = true;
          return {
            data: {
              duplicateFolder: {
                id: "folder1",
                sections: [
                  {
                    folders: [
                      {
                        id: "folder2",
                        pages: [
                          {
                            id: "page",
                          },
                        ],
                      },
                    ],
                    id: "section",
                  },
                ],
              },
            }
          }
        }
      }
      // {
      //   request: {
      //     query: DUPLICATE_FOLDER_MUTATION,
      //     variables: { input: { folderId: firstFolder.id } },
      //   },
      //   result: () => {
      //     duplicateWasCalled = true;
      //     return {
      //       data: {
      //         duplicateFolder: {
      //         ...firstFolder,
      //         position: firstFolder.position,
      //         id: firstFolder.id,
      //         section: [
      //           {
      //             id: firstFolder.section.id,
      //             folders: [
      //               {
      //                 id: firstFolder.id,
      //                 pages: [
      //                   {
      //                     id: "1",
      //                   },
      //                 ],
      //               },
      //             ],
      //           },
      //         ],

      //         pages: [
      //           {
      //           ...firstFolder.pages[0],
      //           position: firstFolder.pages[0].position,
      //           displayName: firstFolder.pages[0].displayName,
      //           pageType: firstFolder.pages[0].displayName,
      //           title: firstFolder.pages[0].title,
      //           // 
      //           // ... on QuestionPage {
      //           //   alias: firstFolder,
      //           //   description: firstFolder,
      //           //   guidance: firstFolder,
      //           //   answers: [
      //           //     ...Answer
      //           //     ... on BasicAnswer {
      //           //       secondaryQCode
      //           //     },
      //           //     ... on MultipleChoiceAnswer {
      //           //       options {
      //           //         id: firstFolder,
      //           //         displayName: firstFolder,
      //           //         label: firstFolder,
      //           //         description: firstFolder,
      //           //         value: firstFolder,
      //           //         qCode: firstFolder,
      //           //       },
      //           //       mutuallyExclusiveOption {
      //           //         id: firstFolder,
      //           //         label: firstFolder,
      //           //         qCode: firstFolder,
      //           //       }
      //           //     }
      //           //   ],
      //           //   confirmation {
      //           //     id
      //           //     qCode
      //           //     displayName
      //           //     validationErrorInfo {
      //           //       ...ValidationErrorInfo
      //           //     }
      //           //   },
      //           // },
      //           // ... on CalculatedSummaryPage {
      //           //   id
      //           // },
      //           // validationErrorInfo {
      //           //   ...ValidationErrorInfo
      //           // },
      //           // 
      //         },
      //         ]
      //       },
      //     }, 
      //     };
      //   },
      // },
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
    // const onCompleteDuplicate = jest.fn();

    const { getByTestId, getByTitle } = renderFolderDesignPage({});

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
