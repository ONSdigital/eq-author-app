import React from "react";
import { shallow } from "enzyme";
import AddMenu from "./AddMenu";

describe("AddMenu", () => {
  let mockHandlers = {
    onAdd: jest.fn(),
    onAddMenuToggle: jest.fn(),
    onAddQuestionPage: jest.fn(),
    onAddSection: jest.fn(),
    onAddQuestionConfirmation: jest.fn(),
    onAddCalculatedSummaryPage: jest.fn(),
  };

  const createWrapper = (props) => {
    const defaultProps = {
      addMenuOpen: true,
      canAddQuestionConfirmation: true,
      canAddCalculatedSummaryPage: true,
      canAddQuestionPage: true,
    };
    return shallow(<AddMenu {...defaultProps} {...mockHandlers} {...props} />);
  };

  it("should render", () => {
    expect(createWrapper({ addMenuOpen: false })).toMatchSnapshot();
  });

  it("should allow a page to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="btn-add-question-page"]').simulate("click");
    expect(mockHandlers.onAddQuestionPage).toHaveBeenCalled();
  });

  it("should allow a section to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="btn-add-section"]').simulate("click");
    expect(mockHandlers.onAddSection).toHaveBeenCalled();
  });

  it("should allow a question confirmation to be added", () => {
    const wrapper = createWrapper();
    wrapper
      .find('[data-test="btn-add-question-confirmation"]')
      .simulate("click");
    expect(mockHandlers.onAddQuestionConfirmation).toHaveBeenCalled();
  });

  it("should allow a calculated summary to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="btn-add-calculated-summary"]').simulate("click");
    expect(mockHandlers.onAddCalculatedSummaryPage).toHaveBeenCalled();
  });

  it("should disable the question confirmation button when you cant add question confirmations", () => {
    const wrapper = createWrapper({ canAddQuestionConfirmation: false });
    expect(
      wrapper.find('[data-test="btn-add-question-confirmation"]').props()
    ).toMatchObject({
      disabled: true,
    });
  });

  it("should disable the Add Question Page button when you cant add question pages", () => {
    const wrapper = createWrapper({ canAddQuestionPage: false });
    expect(
      wrapper.find('[data-test="btn-add-question-page"]').props()
    ).toMatchObject({
      disabled: true,
    });
  });

  it("should disable the Add Calculated Summary button when you cant add question calculated summaries", () => {
    const wrapper = createWrapper({ canAddCalculatedSummaryPage: false });
    expect(
      wrapper.find('[data-test="btn-add-calculated-summary"]').props()
    ).toMatchObject({
      disabled: true,
    });
  });
});
