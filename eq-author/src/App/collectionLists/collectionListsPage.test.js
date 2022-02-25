import React from "react";
import { render, flushPromises, fireEvent, act } from "tests/utils/rtl";
import { MeContext } from "App/MeContext";
import QuestionnaireContext from "components/QuestionnaireContext";

import ListCollectorContent from "./collectionListsPage";

import COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";
import createCollectionListMutation from "graphql/lists/createCollectionListMutation.graphql";
import deleteCollectionListMutation from "graphql/lists/deleteCollectionListMutation.graphql";
import updateCollectionListMutation from "graphql/lists/updateCollectionListMutation.graphql";
import createCollectionListAnswerMutation from "graphql/lists/createCollectionListAnswerMutation.graphql";
import deleteCollectionListAnswerMutation from "graphql/lists/deleteCollectionListAnswerMutation.graphql";
import withUpdateAnswer from "App/page/Design/answers/withUpdateAnswer";
import withCreateExclusive from "App/page/Design/answers/withCreateExclusive";
import withCreateOption from "App/page/Design/answers/withCreateOption";
import withUpdateOption from "App/page/Design/answers/withUpdateOption";
import withDeleteOption from "App/page/Design/answers/withDeleteOption";

const renderListCollectorContent = (questionnaire, user, mocks) => {
  return render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
      <ListCollectorContent questionnaire={questionnaire} />
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/collectionLists`,
      urlParamMatcher: "/q/:questionnaireId/collectionLists",
      mocks,
    }
  );
};

describe("List Collector page", () => {
  let mockQuestionnaire, user, mocks, queryWasCalled;

  beforeEach(() => {
    queryWasCalled = false;

    mockQuestionnaire = {
      title: "Spyro the Dragon",
      shortTitle: "Spyro",
      type: "Business",
      id: "e3c3ecc4-87fb-4819-826b-ac696a4bc569",
      qcodes: true,
      navigation: true,
      hub: false,
      summary: true,
      collapsibleSummary: false,
      collectionLists: {
        id: "3e6583e3-6ab6-455a-9f38-12ddaa9963cb",
        lists: [
          {
            id: "291fd0ef-2f1e-4a2f-aced-96048cc0be48",
            listName: null,
            displayName: "Untitled list",
            answers: [],

            __typename: "List",
          },
        ],
        __typename: "CollectionLists",
      },
      description: "A questionnaire about a lovable, purple dragon",
      surveyId: "123",
      theme: "default",
      displayName: "Roar",
      createdBy: {
        ...user,
      },
      editors: [],
      isPublic: true,
      permission: true,
      sections: [],
    };

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
          query: createCollectionListMutation,
          variables: { id: mockQuestionnaire.id },
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

                  __typename: "List",
                },
              ],
              __typename: "CollectionLists",
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

  it("Should render list collector page", () => {
    const { getByTestId } = renderListCollectorContent(
      mockQuestionnaire,
      user,
      mocks
    );
  });
});
