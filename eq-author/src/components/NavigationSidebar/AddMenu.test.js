import React from "react";
import { shallow } from "enzyme";
import AddMenu from "components/NavigationSidebar/AddMenu";

describe("AddMenu", () => {
  let mockHandlers = {
    onAdd: jest.fn(),
    onAddMenuToggle: jest.fn(),
    onAddPage: jest.fn(),
    onAddSection: jest.fn(),
    onAddQuestionConfirmation: jest.fn()
  };

  const createWrapper = props => {
    const defaultProps = {
      addMenuOpen: true,
      canAddQuestionConfirmation: true
    };
    return shallow(<AddMenu {...defaultProps} {...mockHandlers} {...props} />);
  };

  it("should render", () => {
    expect(createWrapper({ addMenuOpen: false })).toMatchSnapshot();
  });

  it("should allow a page to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="btn-add-question-page"]').simulate("click");
    expect(mockHandlers.onAddPage).toHaveBeenCalled();
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

  it("should disable the question confirmation button when you cant add question confirmations", () => {
    const wrapper = createWrapper({ canAddQuestionConfirmation: false });
    expect(
      wrapper.find('[data-test="btn-add-question-confirmation"]').props()
    ).toMatchObject({
      disabled: true
    });
  });
});
