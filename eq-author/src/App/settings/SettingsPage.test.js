import React from "react";
import { render, act, flushPromises, fireEvent } from "tests/utils/rtl";
import GeneralSettingsPage from "./GeneralSettingsPage";
import { MeContext } from "App/MeContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";
import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";
import updateQuestionnaireIntroductionMutation from "./graphql/updateQuestionnaireIntroduction.graphql";

import config from "config";

const renderSettingsPage = (questionnaire, user, mocks) => {
  return render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
      <GeneralSettingsPage questionnaire={questionnaire} />
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/settings`,
      urlParamMatcher: "/q/:questionnaireId/settings",
      mocks,
    }
  );
};

describe("Settings page", () => {
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
      description: "A questionnaire about a lovable, purple dragon",
      surveyId: "123",
      theme: "default",
      displayName: "Roar",
      introduction: {
        id: "spyro-1",
        showOnHub: false,
      },
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
              title: "Spyro the dragon games",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                title: "Spyro the dragon games",
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
              shortTitle: "Spyro games",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                shortTitle: "Spyro games",
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
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                shortTitle: "S",
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
              qcodes: false,
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                qcodes: false,
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
      {
        request: {
          query: updateQuestionnaireIntroductionMutation,
          variables: {
            input: {
              id: mockQuestionnaire.introduction.id,
              showOnHub: false,
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                hub: true,
                navigation: false,
                introduction: {
                  id: mockQuestionnaire.introduction.id,
                  showOnHub: false,
                },
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
      {
        request: {
          query: updateQuestionnaireIntroductionMutation,
          variables: {
            input: {
              id: mockQuestionnaire.id,
              showOnHub: true,
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaireIntroductionMutation: {
                ...mockQuestionnaire,
                hub: true,
                navigation: false,
                introduction: {
                  id: mockQuestionnaire.introduction.id,
                  showOnHub: true,
                },
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
              showOnHub: true,
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                introduction: {
                  id: mockQuestionnaire.introduction.id,
                  showOnHub: true,
                },
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
              hub: false,
              navigation: false,
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                hub: false,
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
              hub: true,
              navigation: false,
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                hub: true,
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
          queryWasCalled = true;
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
          queryWasCalled = true;
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

  it("Should initially render with the current questionnaire settings displayed", () => {
    const { getByTestId } = renderSettingsPage(mockQuestionnaire, user, mocks);

    const { title, shortTitle, summary, type } = mockQuestionnaire;

    const questionnaiteTitleInput = getByTestId("change-questionnaire-title");
    const questionnaireShortTitleInput = getByTestId(
      "change-questionnaire-short-title"
    );
    const questionnaireTypePill = getByTestId("questionnaire-type");
    const questionnaireSummaryToggle = getByTestId("toggle-answer-summary")
      .children[0];

    expect(questionnaiteTitleInput.value).toBe(title);
    expect(questionnaireShortTitleInput.value).toBe(shortTitle);
    expect(questionnaireTypePill.textContent).toBe(type);
    expect(questionnaireSummaryToggle.checked).toBe(summary);
  });

  describe("Questionnaire title text field", () => {
    it("Should update the questionnaire's title on blur if the value is not an empty string", async () => {
      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const questionnaireTitleInput = getByTestId("change-questionnaire-title");

      expect(questionnaireTitleInput.value).toBe("Spyro the Dragon");

      fireEvent.change(questionnaireTitleInput, {
        target: { value: "Spyro the dragon games" },
      });

      expect(questionnaireTitleInput.value).toBe("Spyro the dragon games");

      expect(queryWasCalled).toBeFalsy();

      await act(async () => {
        fireEvent.blur(questionnaireTitleInput);
      });

      expect(queryWasCalled).toBeTruthy();
    });

    it("Should not update the questionnaire title on blur if the value is an empty string", () => {
      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const questionnaireTitleInput = getByTestId("change-questionnaire-title");

      expect(questionnaireTitleInput.value).toBe("Spyro the Dragon");

      act(() => {
        fireEvent.change(questionnaireTitleInput, {
          target: { value: "" },
        });
      });

      expect(questionnaireTitleInput.value).toBe("");
      expect(queryWasCalled).toBeFalsy();

      act(() => {
        fireEvent.blur(questionnaireTitleInput);
      });

      expect(queryWasCalled).toBeFalsy();
      expect(questionnaireTitleInput.value).toBe("");
    });
  });

  describe("Questionnaire short title text field", () => {
    it("Should update the questionnaire's short title on blur if the value is an empty string", async () => {
      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const questionnaireShortTitleInput = getByTestId(
        "change-questionnaire-short-title"
      );

      expect(questionnaireShortTitleInput.value).toBe("Spyro");

      fireEvent.change(questionnaireShortTitleInput, {
        target: { value: "" },
      });

      expect(questionnaireShortTitleInput.value).toBe("");
      expect(queryWasCalled).toBeFalsy();

      await act(async () => {
        await fireEvent.blur(questionnaireShortTitleInput);
        flushPromises();
      });

      expect(queryWasCalled).toBeTruthy();
      expect(questionnaireShortTitleInput.value).toBe("");
    });

    it("Should update the questionnaire's short title on blur if the value is not empty string", async () => {
      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const questionnaireShortTitleInput = getByTestId(
        "change-questionnaire-short-title"
      );

      expect(questionnaireShortTitleInput.value).toBe("Spyro");

      fireEvent.change(questionnaireShortTitleInput, {
        target: { value: "Spyro games" },
      });

      expect(queryWasCalled).toBeFalsy();
      expect(questionnaireShortTitleInput.value).toBe("Spyro games");

      await act(async () => {
        await fireEvent.blur(questionnaireShortTitleInput);
        flushPromises();
      });

      expect(queryWasCalled).toBeTruthy();
      expect(questionnaireShortTitleInput.value).toBe("Spyro games");
    });
  });

  describe("QCodes toggle", () => {
    it("Should enable and disable qcodes when toggled", async () => {
      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const qcodesToggle = getByTestId("toggle-qcodes");

      const toggle = Object.values(qcodesToggle.children).reduce((child) =>
        child.type === "checkbox" ? child : null
      );

      expect(queryWasCalled).toBeFalsy();

      await act(async () => {
        await fireEvent.click(toggle);
        flushPromises();
      });

      expect(queryWasCalled).toBeTruthy();
    });
  });

  describe("Section navigation toggle", () => {
    it("Should not display collapsible summaries when hub feature flag is enabled", async () => {
      const { queryByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const sectionNavigationToggle = queryByTestId(
        "toggle-section-navigation"
      );

      expect(sectionNavigationToggle).not.toBeInTheDocument();
    });
  });

  describe("Answer summary toggle", () => {
    it("Should enable/disable the answer summary when toggled", async () => {
      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const answerSummaryToggle = getByTestId("toggle-answer-summary");

      const toggle = Object.values(answerSummaryToggle.children).reduce(
        (child) => (child.type === "checkbox" ? child : null)
      );

      expect(queryWasCalled).toBeFalsy();

      await act(async () => {
        await fireEvent.click(toggle);
        flushPromises();
      });

      expect(queryWasCalled).toBeTruthy();
    });
  });

  describe("Hub introduction toggle", () => {
    it("Should display hub introduction toggle switch on business questionnaire type", async () => {
      const { queryByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const hubIntroductionToggle = queryByTestId("toggle-hub-introduction");

      expect(hubIntroductionToggle).toBeInTheDocument();
    });

    it("Should not display hub introduction toggle switch on social questionnaire type", async () => {
      mockQuestionnaire.type = "Social";

      const { queryByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const hubIntroductionToggle = queryByTestId("toggle-hub-introduction");

      expect(hubIntroductionToggle).not.toBeInTheDocument();
    });

    it("Should enable/disable hub introduction when toggled", async () => {
      mockQuestionnaire.hub = true;

      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const hubIntroductionToggle = getByTestId("toggle-hub-introduction");

      const toggle = Object.values(hubIntroductionToggle.children).reduce(
        (child) => (child.type === "checkbox" ? child : null)
      );

      expect(queryWasCalled).toBeFalsy();

      await act(async () => {
        await fireEvent.click(toggle);
        flushPromises();
      });

      expect(queryWasCalled).toBeTruthy();
    });

    it("Should enable hub introduction toggle switch when hub navigation is enabled", async () => {
      mockQuestionnaire.hub = true;

      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const hubIntroductionWrapper = getByTestId(
        "toggle-hub-introduction-wrapper"
      );

      expect(hubIntroductionWrapper).toHaveStyleRule("pointer-events", "auto");
    });

    it("Should disable hub introduction toggle switch when hub navigation is disabled", async () => {
      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const hubIntroductionWrapper = getByTestId(
        "toggle-hub-introduction-wrapper"
      );

      expect(hubIntroductionWrapper).toHaveStyleRule("pointer-events", "none");
    });
  });
});
