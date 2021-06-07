import React from "react";
import { render, act, flushPromises, screen, fireEvent } from "tests/utils/rtl";
import ThemesPage from "./ThemesPage";
import { useMutation } from "@apollo/react-hooks";
import { THEME_ERROR_MESSAGES } from "constants/validationMessages";
import { LEGAL_BASIS_OPTIONS } from "App/settings/LegalBasisSelect";

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
          {
            title: "GB theme",
            legalBasisCode: "NOTICE_1",
            shortName: "default",
            enabled: true,
            validationErrorInfo: {
              errors: [
                {
                  id: "1",
                  keyword: "errorMessage",
                  field: "formType",
                  errorCode: "ERR_FORM_TYPE_FORMAT",
                },
              ],
            },
          },
          {
            title: "NI theme",
            legalBasisCode: "NOTICE_1",
            shortName: "northernireland",
            validationErrorInfo: { errors: [] },
          },
          {
            title: "COVID theme",
            legalBasisCode: "NOTICE_1",
            shortName: "covid",
            validationErrorInfo: { errors: [] },
          },
          {
            title: "EPE theme",
            legalBasisCode: "NOTICE_1",
            shortName: "epe",
            validationErrorInfo: { errors: [] },
          },
          {
            title: "EPE NI theme",
            legalBasisCode: "NOTICE_1",
            shortName: "epeni",
            validationErrorInfo: { errors: [] },
          },
          {
            title: "UKIS theme",
            legalBasisCode: "NOTICE_1",
            shortName: "ukis",
            validationErrorInfo: { errors: [] },
          },
          {
            title: "UKIS NI theme",
            legalBasisCode: "NOTICE_1",
            shortName: "ukisni",
            validationErrorInfo: { errors: [] },
          },
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
            eqId: " ",
            shortName: "default",
          },
        },
      })
    );
  });

  it("Should display Form Type", () => {
    renderThemesPage(mockQuestionnaire);

    expect(screen.getByText("Form type")).toBeVisible();
  });

  it("Should handle Form Type update", () => {
    const handleFormTypeBlur = jest.fn();
    useMutation.mockImplementation(() => [handleFormTypeBlur]);
    renderThemesPage(mockQuestionnaire);

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

  describe("Legal basis", () => {
    beforeEach(() => renderThemesPage(mockQuestionnaire));

    it("should display legal basis for themes", () => {
      expect(screen.getByText("Legal basis")).toBeVisible();
    });

    it("should show theme's legal basis as selected in radio list", () => {
      const legalBasisDescription = LEGAL_BASIS_OPTIONS.find(
        ({ value }) => value === "NOTICE_1"
      ).description;

      expect(screen.getByLabelText(legalBasisDescription)).toBeChecked();
    });
  });

  describe("Validation", () => {
    it("should show a validation error if no themes are enabled", () => {
      renderThemesPage({
        ...mockQuestionnaire,
        themeSettings: {
          ...mockQuestionnaire.themeSettings,
          validationErrorInfo: {
            id: "valid-1",
            errors: [
              {
                id: "error-1",
                type: "themeSettings",
                errorCode: "ERR_NO_THEME_ENABLED",
              },
            ],
          },
        },
      });

      expect(
        screen.getByText(THEME_ERROR_MESSAGES.ERR_NO_THEME_ENABLED)
      ).toBeTruthy();
    });

    it("should show a validation error if incorrect form type format is entered", () => {
      renderThemesPage(mockQuestionnaire);

      expect(
        screen.getByText(THEME_ERROR_MESSAGES.ERR_FORM_TYPE_FORMAT)
      ).toBeTruthy();
    });
  });
});
