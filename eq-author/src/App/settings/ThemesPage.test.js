import React from "react";
import { render, act, flushPromises, screen, fireEvent } from "tests/utils/rtl";
import ThemesPage from "./ThemesPage";
import { MeContext } from "App/MeContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";
import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";
import { useMutation } from "@apollo/react-hooks";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useMutation: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));
const renderThemesPage = (questionnaire, user, mocks) => {
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

describe("Themes page", () => {
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
      surveyId: "123",
      theme: "default",
      themes: [
        { title: "GB theme", shortName: "default", enabled: true },
        { title: "NI theme", shortName: "northernireland" },
        { title: "COVID theme", shortName: "covid" },
        { title: "EPE theme", shortName: "epe" },
        { title: "EPE NI theme", shortName: "epeni" },
        { title: "UKIS theme", shortName: "ukis" },
        { title: "UKIS NI theme", shortName: "ukisni" },
      ],
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
    const { getByTestId } = renderThemesPage(mockQuestionnaire, user, mocks);

    expect(getByTestId("theme-description")).toBeTruthy();
  });

  it("Should change surveyId", () => {
    const onBlur = jest.fn();
    useMutation.mockImplementation(() => [onBlur]);
    renderThemesPage(mockQuestionnaire, user, mocks);

    const questionnaireIdInput = screen.getByTestId("change-questionnaire-id");

    expect(questionnaireIdInput).toBeVisible();
    expect(questionnaireIdInput.value).toBe("123");

    fireEvent.change(questionnaireIdInput, {
      target: { value: "124" },
    });

    expect(questionnaireIdInput.value).toBe("124");
    fireEvent.blur(questionnaireIdInput);
    expect(onBlur).toHaveBeenCalledWith({
      variables: {
        input: { id: expect.any(String), surveyId: "124" },
      },
    });
  });

  it("Should change to empty surveyId", () => {
    const onBlur = jest.fn();
    useMutation.mockImplementation(() => [onBlur]);
    renderThemesPage(mockQuestionnaire, user, mocks);

    const questionnaireIdInput = screen.getByTestId("change-questionnaire-id");

    expect(questionnaireIdInput).toBeVisible();
    expect(questionnaireIdInput.value).toBe("123");

    fireEvent.change(questionnaireIdInput, {
      target: { value: " " },
    });

    expect(questionnaireIdInput.value).toBe(" ");
    fireEvent.blur(questionnaireIdInput);
    expect(onBlur).toHaveBeenCalledWith({
      variables: {
        input: { id: expect.any(String), surveyId: "" },
      },
    });
  });

  it("Should render themes", () => {
    const toggleTheme = jest.fn();
    useMutation.mockImplementation(() => [toggleTheme]);
    renderThemesPage(mockQuestionnaire, user, mocks);

    expect(screen.getByText(`EPE theme`)).toBeVisible();
  });

  it("Should toggle theme enabled", () => {
    const toggleTheme = jest.fn();
    useMutation.mockImplementation(() => [toggleTheme]);
    renderThemesPage(mockQuestionnaire, user, mocks);

    const toggleSwitch = screen.getByTestId(`COVID theme-input`);

    fireEvent.click(toggleSwitch);
    expect(toggleTheme).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            questionnaireId: expect.any(String),
            shortName: "covid",
          },
        },
      })
    );
  });

  it("Should display EQ ID", () => {
    renderThemesPage(mockQuestionnaire, user, mocks);

    expect(screen.getByText("eQ ID")).toBeVisible();
  });

  it("Should handle EQ ID update", () => {
    const handleEQIdBlur = jest.fn();
    useMutation.mockImplementation(() => [handleEQIdBlur]);
    renderThemesPage(mockQuestionnaire, user, mocks);

    const eqIdInput = screen.getByTestId("default-eq-id-input");

    fireEvent.change(eqIdInput, {
      target: { value: "123" },
    });

    fireEvent.blur(eqIdInput);
    expect(handleEQIdBlur).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            questionnaireId: expect.any(String),
            eqId: "123",
            shortName: "default",
          },
        },
      })
    );
  });

  it("Should handle EQ ID change when not empty", () => {
    const handleEQIdBlur = jest.fn();
    useMutation.mockImplementation(() => [handleEQIdBlur]);
    renderThemesPage(mockQuestionnaire, user, mocks);

    const eqIdInput = screen.getByTestId("default-eq-id-input");

    fireEvent.change(eqIdInput, {
      target: { value: " " },
    });

    fireEvent.blur(eqIdInput);
    expect(handleEQIdBlur).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            questionnaireId: expect.any(String),
            eqId: "",
            shortName: "default",
          },
        },
      })
    );
  });

  it("Should display Form Type", () => {
    renderThemesPage(mockQuestionnaire, user, mocks);

    expect(screen.getByText("Form type")).toBeVisible();
  });

  it("Should handle Form Type update", () => {
    const handleFormTypeBlur = jest.fn();
    useMutation.mockImplementation(() => [handleFormTypeBlur]);
    renderThemesPage(mockQuestionnaire, user, mocks);

    const formTypeInput = screen.getByTestId("default-form-type-input");

    fireEvent.change(formTypeInput, {
      target: { value: "123" },
    });

    fireEvent.blur(formTypeInput);
    expect(handleFormTypeBlur).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            questionnaireId: expect.any(String),
            formType: "123",
            shortName: "default",
          },
        },
      })
    );
  });

  it("Should remove spaces when there are any", () => {
    const handleFormTypeBlur = jest.fn();
    useMutation.mockImplementation(() => [handleFormTypeBlur]);
    renderThemesPage(mockQuestionnaire, user, mocks);

    const formTypeInput = screen.getByTestId("default-form-type-input");

    fireEvent.change(formTypeInput, {
      target: { value: " " },
    });

    fireEvent.blur(formTypeInput);
    
    expect(handleFormTypeBlur).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: {
            questionnaireId: expect.any(String),
            formType: "",
            shortName: "default",
          },
        },
      })
    );
  });
});
