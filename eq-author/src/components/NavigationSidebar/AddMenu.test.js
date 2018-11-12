import React from "react";
import { shallow } from "enzyme";
import AddMenu from "components/NavigationSidebar/AddMenu";

describe("AddMenu", () => {
  let mockHandlers = {
    onAdd: jest.fn(),
    onAddMenuToggle: jest.fn(),
    onAddPage: jest.fn(),
    onAddSection: jest.fn()
  };

  const createWrapper = (props = { addMenuOpen: false }) =>
    shallow(<AddMenu {...props} {...mockHandlers} />);

  it("should render", () => {
    expect(createWrapper()).toMatchSnapshot();
  });

  it("should allow a page to be added", () => {
    const wrapper = createWrapper({ addMenuOpen: true });
    wrapper.find('[data-test="btn-add-question-page"]').simulate("click");
    expect(mockHandlers.onAddPage).toHaveBeenCalled();
  });

  it("should allow a section to be added", () => {
    const wrapper = createWrapper({ addMenuOpen: true });
    wrapper.find('[data-test="btn-add-section"]').simulate("click");
    expect(mockHandlers.onAddSection).toHaveBeenCalled();
  });
});
