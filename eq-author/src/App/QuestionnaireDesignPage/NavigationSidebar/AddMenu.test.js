import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import AddMenu from "./AddMenu";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(() => ({ entityType: "section" })),
}));

const defaultProps = {
  addMenuOpen: true,
  canAddQuestionConfirmation: true,
  canAddCalculatedSummaryPage: true,
  canAddQuestionPage: true,
  onAddMenuToggle: jest.fn(),
  onAddQuestionPage: jest.fn(),
  onAddSection: jest.fn(),
  onAddQuestionConfirmation: jest.fn(),
  onAddCalculatedSummaryPage: jest.fn(),
  onAddFolder: jest.fn(),
  canAddFolder: true,
};

const defaultSetup = (newProps = {}) => {
  const props = { ...defaultProps, ...newProps };

  const utils = render(<AddMenu {...props} />);

  return { ...utils, ...props };
};

describe("AddMenu", () => {
  it("should render", () => {
    const { getByTestId, queryByTestId } = defaultSetup({
      addMenuOpen: false,
    });
    expect(getByTestId("add-menu")).toBeVisible();
    expect(queryByTestId("addmenu-window")).toBeNull();
  });

  it("should allow a page to be added", () => {
    const { getByTestId, onAddQuestionPage } = defaultSetup();
    fireEvent.click(getByTestId("btn-add-question-page"));
    expect(onAddQuestionPage).toHaveBeenCalled();
  });

  it("should disable the Add Question Page button when you cant add question pages", () => {
    const { getByTestId } = defaultSetup({ canAddQuestionPage: false });
    expect(getByTestId("btn-add-question-page")).toBeDisabled();
  });

  it("should allow a section to be added", () => {
    const { getByTestId, onAddSection } = defaultSetup();
    fireEvent.click(getByTestId("btn-add-section"));
    expect(onAddSection).toHaveBeenCalled();
  });

  it("should allow a question confirmation to be added", () => {
    const { getByTestId, onAddQuestionConfirmation } = defaultSetup();
    fireEvent.click(getByTestId("btn-add-question-confirmation"));
    expect(onAddQuestionConfirmation).toHaveBeenCalled();
  });

  it("should disable the question confirmation button when you cant add question confirmations", () => {
    const { getByTestId } = defaultSetup({ canAddQuestionConfirmation: false });
    expect(getByTestId("btn-add-question-confirmation")).toBeDisabled();
  });

  it("should allow a calculated summary to be added", () => {
    const { getByTestId, onAddCalculatedSummaryPage } = defaultSetup();
    fireEvent.click(getByTestId("btn-add-calculated-summary"));
    expect(onAddCalculatedSummaryPage).toHaveBeenCalled();
  });

  it("should disable the Add Calculated Summary button when you cant add question calculated summaries", () => {
    const { getByTestId } = defaultSetup({
      canAddCalculatedSummaryPage: false,
    });
    expect(getByTestId("btn-add-calculated-summary")).toBeDisabled();
  });
});
