import React from "react";
import {
  render,
  flushPromises,
  fireEvent,
  act,
  screen,
  waitFor,
} from "tests/utils/rtl";
import { MeContext } from "App/MeContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";

import ListCollectorContent from "./collectionListsPage";

import COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";
import CREATE_COLLECTION_LIST from "graphql/lists/createCollectionListMutation.graphql";
import DELETE_COLLECTION_LIST from "graphql/lists/deleteCollectionListMutation.graphql";
import UPDATE_COLLECTION_LIST from "graphql/lists/updateCollectionListMutation.graphql";

const renderListCollectorContent = (user, mocks) => {
  return render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
      <ListCollectorContent />
    </MeContext.Provider>,
    {
      route: `/q/e3c3ecc4-87fb-4819-826b-ac696a4bc569/collectionLists`,
      urlParamMatcher: "/q/:questionnaireId/collectionLists",
      mocks,
    }
  );
};

describe("List Collector page", () => {
  let user, mocks;

  beforeEach(() => {
    user = {
      id: "123",
      displayName: "TerradorTheDragon",
      email: "TDawg@Spyro.com",
      picture: "",
      admin: true,
      name: "Terrador",
      __typename: "User",
    };

    mocks = [
      {
        request: {
          query: COLLECTION_LISTS,
          variables: {},
        },
        result: () => ({
          data: {
            collectionLists: {
              id: "3e6583e3-6ab6-455a-9f38-12ddaa9963cb",
              lists: [],
              __typename: "CollectionLists",
            },
          },
        }),
      },
      {
        request: {
          query: CREATE_COLLECTION_LIST,
          variables: {},
        },
        result: () => ({
          data: {
            createList: {
              id: "3e6583e3-6ab6-455a-9f38-12ddaa9963cb",
              lists: [
                {
                  id: "291fd0ef-2f1e-4a2f-aced-96048cc0be48",
                  listName: null,
                  displayName: "Untitled list",
                  answers: [],
                  metadata: [],
                  validationErrorInfo: {
                    errors: [
                      {
                        errorCode: "LISTNAME_MISSING",
                        field: "listName",
                        id: "4defb7eb-9d0b-46f1-9ae5-a3b9135a687c",
                        type: "list",
                        __typename: "ValidationError",
                      },
                    ],
                    id: "2bf14226-6c24-4f2e-b15e-b485181212bf",
                    totalCount: "1",
                    __typename: "ValidationErrorInfo",
                  },
                  __typename: "List",
                },
              ],
              __typename: "CollectionLists",
            },
          },
        }),
      },
      {
        request: {
          query: UPDATE_COLLECTION_LIST,
          variables: {
            input: {
              id: "291fd0ef-2f1e-4a2f-aced-96048cc0be48",
              listName: null,
            },
          },
        },
        result: () => ({
          data: {
            updateList: {
              lists: [
                {
                  id: "291fd0ef-2f1e-4a2f-aced-96048cc0be48",
                  listName: null,
                  displayName: "Untitled list",
                  answers: [],
                  metadata: [],
                  validationErrorInfo: {
                    errors: [
                      {
                        errorCode: "LISTNAME_MISSING",
                        field: "listName",
                        id: "4defb7eb-9d0b-46f1-9ae5-a3b9135a687c",
                        type: "list",
                        __typename: "ValidationError",
                      },
                    ],
                    id: "2bf14226-6c24-4f2e-b15e-b485181212bf",
                    totalCount: "1",
                    __typename: "ValidationErrorInfo",
                  },
                  __typename: "List",
                },
              ],
              __typename: "CollectionLists",
            },
          },
        }),
      },
      {
        request: {
          query: DELETE_COLLECTION_LIST,
          variables: { input: { id: "291fd0ef-2f1e-4a2f-aced-96048cc0be48" } },
        },
        result: () => ({
          data: {
            deleteList: {
              id: "3e6583e3-6ab6-455a-9f38-12ddaa9963cb",
              lists: [],
              __typename: "CollectionLists",
            },
          },
        }),
      },
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: "e3c3ecc4-87fb-4819-826b-ac696a4bc569" },
        },
        result: () => ({
          data: {
            publishStatusUpdated: {
              id: "e3c3ecc4-87fb-4819-826b-ac696a4bc569",
              publishStatus: "Unpublished",
              __typename: "Questionnaire",
            },
          },
        }),
      },
    ];
  });
  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  it("Should render empty list collector page", async () => {
    renderListCollectorContent(user, mocks);

    await waitFor(() => screen.getByTestId("btn-add-list"));
    expect(screen.getByText("Currently no lists")).toBeTruthy();
  });

  it("Should add one untitled list", async () => {
    renderListCollectorContent(user, mocks);

    await waitFor(() => screen.getByTestId("btn-add-list"));
    fireEvent.click(screen.getByTestId("btn-add-list"));
    await waitFor(() => screen.getByTestId("btn-add-list"));
    expect(screen.getByText("Untitled list")).toBeTruthy();
  });

  it("Should delete a list", async () => {
    renderListCollectorContent(user, mocks);

    await waitFor(() => screen.getByTestId("btn-add-list"));
    fireEvent.click(screen.getByTestId("btn-add-list"));

    await waitFor(() => screen.getByTestId("btn-delete-item"));
    expect(screen.getByText("Untitled list")).toBeTruthy();

    fireEvent.click(screen.getByTestId("btn-delete-item"));
    await waitFor(() => screen.getByTestId("btn-modal-negative"));
    fireEvent.click(screen.getByTestId("btn-modal-negative"));
    await waitFor(() => screen.getByTestId("btn-add-list"));
    expect(screen.queryByText("Currently no lists")).toBeFalsy();
    expect(screen.getByText("Untitled list")).toBeTruthy();
  });

  it("Should close delete modal", async () => {
    renderListCollectorContent(user, mocks);

    await waitFor(() => screen.getByTestId("btn-add-list"));
    fireEvent.click(screen.getByTestId("btn-add-list"));

    await waitFor(() => screen.getByTestId("btn-delete-item"));
    expect(screen.getByText("Untitled list")).toBeTruthy();

    fireEvent.click(screen.getByTestId("btn-delete-item"));
    await waitFor(() => screen.getByTestId("btn-modal-positive"));
    fireEvent.click(screen.getByTestId("btn-modal-positive"));
    await waitFor(() => screen.getByTestId("btn-add-list"));
    expect(screen.getByText("Currently no lists")).toBeTruthy();
  });
});
