import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import AddMenu from "./AddMenu";

const defaultProps = () => ({
  addMenuOpen: true,
  canAddQuestionConfirmation: true,
  canAddCalculatedSummaryPage: true,
  canAddQuestionPage: true,
  canAddSection: true,
  onAddMenuToggle: jest.fn(),
  onAddQuestionPage: jest.fn(),
  onAddSection: jest.fn(),
  onAddQuestionConfirmation: jest.fn(),
  onAddCalculatedSummaryPage: jest.fn(),
  onAddFolder: jest.fn(),
  onStartImportingContent: jest.fn(),
  canAddFolder: true,
  isFolder: false,
  folderTitle: "",
});

const defaultSetup = (newProps = {}) => {
  const addQuestion = "btn-add-question-page";
  const addQuestionInside = "btn-add-question-page-inside";
  const addSection = "btn-add-section";
  const addConfirmation = "btn-add-question-confirmation";
  const addCalcSum = "btn-add-calculated-summary";
  const addCalcSumInside = "btn-add-calculated-summary-inside";

  const props = { ...defaultProps(), ...newProps };

  const utils = render(<AddMenu {...props} />);

  return {
    ...utils,
    ...props,
    addQuestion,
    addQuestionInside,
    addSection,
    addConfirmation,
    addCalcSum,
    addCalcSumInside,
  };
};

describe("AddMenu", () => {
  it("should render", () => {
    const { getByTestId, queryByTestId } = defaultSetup({
      addMenuOpen: false,
    });
    expect(getByTestId("btn-add-menu")).toBeVisible();
    expect(queryByTestId("addmenu-window")).toBeNull();
  });

  it("should allow a page to be added", () => {
    const { getByTestId, onAddQuestionPage, addQuestion } = defaultSetup();
    fireEvent.click(getByTestId(addQuestion));
    expect(onAddQuestionPage).toHaveBeenCalled();
  });

  it("should disable the Add Question Page button when you cant add question pages", () => {
    const { getByTestId, addQuestion } = defaultSetup({
      canAddQuestionPage: false,
    });
    expect(getByTestId(addQuestion)).toBeDisabled();
  });

  it("should allow a section to be added", () => {
    const { getByTestId, onAddSection, addSection } = defaultSetup();
    fireEvent.click(getByTestId(addSection));
    expect(onAddSection).toHaveBeenCalled();
  });

  it("should allow a question confirmation to be added", () => {
    const {
      getByTestId,
      onAddQuestionConfirmation,
      addConfirmation,
    } = defaultSetup();
    fireEvent.click(getByTestId(addConfirmation));
    expect(onAddQuestionConfirmation).toHaveBeenCalled();
  });

  it("should disable the question confirmation button when you cant add question confirmations", () => {
    const { getByTestId, addConfirmation } = defaultSetup({
      canAddQuestionConfirmation: false,
    });
    expect(getByTestId(addConfirmation)).toBeDisabled();
  });

  it("should allow a calculated summary to be added", () => {
    const {
      getByTestId,
      onAddCalculatedSummaryPage,
      addCalcSum,
    } = defaultSetup();
    fireEvent.click(getByTestId(addCalcSum));
    expect(onAddCalculatedSummaryPage).toHaveBeenCalled();
  });

  it("should disable the Add Calculated Summary button when you cant add question calculated summaries", () => {
    const { getByTestId, addCalcSum } = defaultSetup({
      canAddCalculatedSummaryPage: false,
    });
    expect(getByTestId(addCalcSum)).toBeDisabled();
  });

  it("should allow a question page to be added inside a folder", () => {
    const { getByTestId, onAddQuestionPage, addQuestionInside } = defaultSetup({
      isFolder: true,
    });
    fireEvent.click(getByTestId(addQuestionInside));
    expect(onAddQuestionPage).toHaveBeenCalledWith(true);
  });

  it("should allow a calculated summary to be added inside a folder", () => {
    const {
      getByTestId,
      onAddCalculatedSummaryPage,
      addCalcSumInside,
    } = defaultSetup({
      isFolder: true,
    });
    fireEvent.click(getByTestId(addCalcSumInside));
    expect(onAddCalculatedSummaryPage).toHaveBeenCalledWith(true);
  });
});
