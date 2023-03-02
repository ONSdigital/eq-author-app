import React from "react";
import { render, act, flushPromises, fireEvent } from "tests/utils/rtl";
import SettingsPage from "./SettingsPage";
import { MeContext } from "App/MeContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";
import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";
import updateQuestionnaireIntroductionMutation from "graphql/updateQuestionnaireIntroduction.graphql";

const renderSettingsPage = (questionnaire, user, mocks) => {
  return render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
      <SettingsPage questionnaire={questionnaire} />
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

    user = {
      id: "123",
      displayName: "TerradorTheDragon",
      email: "TDawg@Spyro.com",
      picture: "",
      admin: true,
      name: "Terrador",
      __typename: "User",
    };

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
      formType: "1234",
      eqId: "Test eQ ID",
      legalBasis: "NOTICE_1",
      theme: "business",
      displayName: "Roar",
      introduction: {
        id: "spyro-1",
        showOnHub: false,
        __typename: "QuestionnaireIntroduction",
      },
      createdBy: {
        ...user,
      },
      editors: [],
      isPublic: true,
      permission: true,
      sections: [],
      validationErrorInfo: {
        id: "validation-error-info-id",
        errors: [],
        totalCount: 0,
        __typename: "ValidationErrorInfo",
      },
      __typename: "Questionnaire",
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
      {
        request: {
          query: updateQuestionnaireMutation,
          variables: {
            input: {
              id: mockQuestionnaire.id,
              surveyId: "456",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                surveyId: "456",
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
              formType: "5678",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                formType: "5678",
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
              eqId: "New test eQ ID",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                ...mockQuestionnaire,
                eqId: "New test eQ ID",
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

    const { title, shortTitle, summary } = mockQuestionnaire;

    const questionnaiteTitleInput = getByTestId("change-questionnaire-title");
    const questionnaireShortTitleInput = getByTestId(
      "change-questionnaire-short-title"
    );
    const questionnaireSummaryToggle = getByTestId("toggle-answer-summary")
      .children[0];

    expect(questionnaiteTitleInput.value).toBe(title);
    expect(questionnaireShortTitleInput.value).toBe(shortTitle);
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

  describe("Survey ID, form type and eQ ID", () => {
    it("should update the questionnaire's survey ID", async () => {
      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const surveyIdInput = getByTestId("input-survey-id");

      expect(surveyIdInput.value).toBe("123");

      expect(queryWasCalled).toBeFalsy();

      fireEvent.change(surveyIdInput, {
        target: { value: "456" },
      });

      expect(surveyIdInput.value).toBe("456");

      await act(async () => {
        fireEvent.blur(surveyIdInput);
      });

      expect(queryWasCalled).toBeTruthy();
    });

    it("should update the questionnaire's form type", async () => {
      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const formTypeInput = getByTestId("input-form-type");

      expect(formTypeInput.value).toBe("1234");

      expect(queryWasCalled).toBeFalsy();

      fireEvent.change(formTypeInput, {
        target: { value: "5678" },
      });

      expect(formTypeInput.value).toBe("5678");

      await act(async () => {
        fireEvent.blur(formTypeInput);
      });

      expect(queryWasCalled).toBeTruthy();
    });

    it("should update the questionnaire's eQ ID", async () => {
      const { getByTestId } = renderSettingsPage(
        mockQuestionnaire,
        user,
        mocks
      );

      const eqIdInput = getByTestId("input-eq-id");

      expect(eqIdInput.value).toBe("Test eQ ID");

      expect(queryWasCalled).toBeFalsy();

      fireEvent.change(eqIdInput, {
        target: { value: "New test eQ ID" },
      });

      expect(eqIdInput.value).toBe("New test eQ ID");

      await act(async () => {
        fireEvent.blur(eqIdInput);
      });

      expect(queryWasCalled).toBeTruthy();
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
