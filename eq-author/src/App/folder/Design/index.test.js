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
import DELETE_FOLDER_MUTATION from "./deleteFolder.graphql";

import FolderDesignPage from "./";

const mockQuestionnaire = buildQuestionnaire();
const secondFolder = mockQuestionnaire.sections[0].folders[1];

const mockUser = {
  id: "123",
  displayName: "Raymond Holt",
  email: "RaymondHolt@TheNineNine.com",
  picture: "http://img.com/avatar.jpg",
  admin: true,
};

let mocks, deleteWasCalled;

// const data = {
//   folder: {
//     alias: "",
//     id: "42fb2703-57ab-4021-bb5a-0c89231761f2",
//     pages: [
//       {
//         id: "pageId1",
//       },
//     ],
//     position: 1,
//     section: {
//       id: "d69a4834-0f63-4014-aecf-9528c4aa72bf",
//       __typename: "Section",
//     },
//   },
// };
// const deletefolderdata = {
//   deleteFolder: {
//     id: mockQuestionnaire.id,
//     sections: [
//       {
//         folders: [
//           {
//             id: "1.2",
//             pages: [
//               {
//                 id: "1.2.1",
//                 __typename: "QuestionPage",
//               },
//             ],
//             __typename: "Folder",
//           },
//         ],
//         id: "1",
//         __typename: "Section",
//       },
//     ],
//     __typename: "Questionnaire",
//   },
// };

// jest.mock("@apollo/react-hooks", () => ({
//   __esModule: true,
//   useQuery: jest.fn(),
//   useMutation: jest.fn(),
// }));

// useQuery.mockImplementation(() => ({
//   data: data,
//   loading: false,
// }));

// useMutation.mockImplementation(() => ({
//   data: deletefolderdata,
//   loading: false,
// }));

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
          query: DELETE_FOLDER_MUTATION,
          variables: { input: { id: secondFolder.id } },
        },
        result: () => {
          deleteWasCalled = true;
          return {
            data: {
              deleteFolder: {
                id: mockQuestionnaire.id,
                sections: [
                  {
                    id: "2",
                    folders: [
                      {
                        id: "1.1",
                        pages: [
                          {
                            id: "1.1.1",
                            __typename: "QuestionPage",
                          },
                        ],
                        __typename: "Folder",
                      },
                    ],
                    __typename: "Section",
                  },
                ],
                __typename: "Questionnaire",
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

    // expect(getByTestId("delete-confirm-modal")).toBeVisible();

    await act(async () => {
      await fireEvent.click(getByTestId("btn-delete-modal"));
    });

    await act(async () => {
      await flushPromises();
    });
    expect(deleteWasCalled).toBeTruthy();
  });
});
