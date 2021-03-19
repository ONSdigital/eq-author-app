import React from "react";
import { render, act, flushPromises } from "tests/utils/rtl";
import ThemesPage from "./ThemesPage";
import { MeContext } from "App/MeContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";
import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";

const renderSettingsPage = (questionnaire, user, mocks) => {
  return render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
      <ThemesPage questionnaire={questionnaire} />
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/settings/themes`,
      urlParamMatcher: "/q/:questionnaireId/settings/themes",
      mocks,
    }
  );
};

describe("Settings page", () => {
  let mockQuestionnaire, user, mocks;

  beforeEach(() => {
    mockQuestionnaire = {
      title: "Test",
      shortTitle: "T",
      type: "Business",
      id: "7320fe2a-e6a3-4552-a66b-b8426b8ad331",
      navigation: true,
      summary: true,
      collapsibleSummary: false,
      description: "Questionnaire",
      surveyId: "1",
      theme: "default",
      displayName: "Tests",
      createdBy: {
        ...user,
      },
      editors: [],
      isPublic: true,
      permission: true,
      sections: [],
    };

    user = {
      id: "1",
      displayName: "Name",
      email: "name@gmail.com",
      picture: "",
      admin: true,
      name: "Name",
      __typename: "User",
    };

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
          query: updateQuestionnaireMutation,
          variables: {
            input: {
              id: mockQuestionnaire.id,
              title: "Test",
            },
          },
        },
        result: () => {
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                title: "Test",
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
      {
        request: {
          query: updateQuestionnaireMutation,
          variables: {
            input: {
              id: mockQuestionnaire.id,
              shortTitle: "T",
            },
          },
        },
        result: () => {
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                shortTitle: "T",
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
      {
        request: {
          query: updateQuestionnaireMutation,
          variables: {
            input: {
              id: mockQuestionnaire.id,
              shortTitle: "",
            },
          },
        },
        result: () => {
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                shortTitle: "T",
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
      {
        request: {
          query: updateQuestionnaireMutation,
          variables: {
            input: {
              id: mockQuestionnaire.id,
              navigation: false,
            },
          },
        },
        result: () => {
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                navigation: false,
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
      {
        request: {
          query: updateQuestionnaireMutation,
          variables: {
            input: {
              id: mockQuestionnaire.id,
              summary: false,
              collapsibleSummary: false,
            },
          },
        },
        result: () => {
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                summary: false,
                collapsibleSummary: false,
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
      {
        request: {
          query: updateQuestionnaireMutation,
          variables: {
            input: {
              id: mockQuestionnaire.id,
              collapsibleSummary: true,
            },
          },
        },
        result: () => {
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                collapsibleSummary: true,
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
    ];
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  it("Should render themes page", () => {
    const { getByTestId } = renderSettingsPage(mockQuestionnaire, user, mocks);

    expect(getByTestId("theme-description")).toBeTruthy();
  });
});
