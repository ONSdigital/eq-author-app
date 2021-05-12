import React from "react";
import { render, act, flushPromises, screen, fireEvent } from "tests/utils/rtl";
import ThemesPage from "./ThemesPage";
import { useMutation } from "@apollo/react-hooks";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useMutation: jest.fn(),
  useSubscription: jest.fn(() => jest.fn()),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));
const renderThemesPage = (questionnaire) => {
  return render(<ThemesPage questionnaire={questionnaire} />, {
    route: `/q/${questionnaire.id}/settings/themes`,
    urlParamMatcher: "/q/:questionnaireId/settings/themes",
  });
};

describe("Themes page", () => {
  let mockQuestionnaire;

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
      themeSettings: {
        previewTheme: "default",
        validationErrorInfo: {
          id: "valid-1",
          errors: [],
          totalCount: 0,
        },
        themes: [
          { title: "GB theme", shortName: "default", enabled: true },
          { title: "NI theme", shortName: "northernireland" },
          { title: "COVID theme", shortName: "covid" },
          { title: "EPE theme", shortName: "epe" },
          { title: "EPE NI theme", shortName: "epeni" },
          { title: "UKIS theme", shortName: "ukis" },
          { title: "UKIS NI theme", shortName: "ukisni" },
        ],
      },
      displayName: "Tests",
      editors: [],
      isPublic: true,
      permission: true,
      sections: [],
    };
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  it("Should render themes page", () => {
    const { getByTestId } = renderThemesPage(mockQuestionnaire);
    expect(getByTestId("theme-description")).toBeTruthy();
  });

  it("Should change surveyId", () => {
    const onBlur = jest.fn();
    useMutation.mockImplementation(() => [onBlur]);
    renderThemesPage(mockQuestionnaire);

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
    renderThemesPage(mockQuestionnaire);

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
    renderThemesPage(mockQuestionnaire);

    expect(screen.getByText(`EPE theme`)).toBeVisible();
  });

  it("Should toggle theme enabled", () => {
    const toggleTheme = jest.fn();
    useMutation.mockImplementation(() => [toggleTheme]);
    renderThemesPage(mockQuestionnaire);

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
    renderThemesPage(mockQuestionnaire);

    expect(screen.getByText("eQ ID")).toBeVisible();
  });

  it("Should handle EQ ID update", () => {
    const handleEQIdBlur = jest.fn();
    useMutation.mockImplementation(() => [handleEQIdBlur]);
    renderThemesPage(mockQuestionnaire);

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
    renderThemesPage(mockQuestionnaire);

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
});
