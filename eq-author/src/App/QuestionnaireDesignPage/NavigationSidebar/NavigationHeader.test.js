import React from "react";
import { shallow } from "enzyme";
import { render, fireEvent } from "tests/utils/rtl";

import { UnwrappedNavigationHeader as NavigationHeader } from "./NavigationHeader";

describe("NavigationHeader", () => {
  const mockHandlers = {
    onAddQuestionPage: jest.fn(),
    onAddSection: jest.fn(),
    onAddQuestionConfirmation: jest.fn(),
    onAddCalculatedSummaryPage: jest.fn(),
  };
  const props = {
    questionnaire: {},
    canAddQuestionPage: true,
    canAddCalculatedSummaryPage: true,
    canAddQuestionConfirmation: true,
    onUpdateQuestionnaire: jest.fn(),
    match: { params: { questionnaireId: "1" } },
    me: { id: "123", email: "j@h.com", admin: true },
    ...mockHandlers,
  };
  const createWrapper = () => shallow(<NavigationHeader {...props} />);

  it("should render", () => {
    expect(createWrapper()).toMatchSnapshot();
  });

  it("should allow a page to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="add-menu"]').simulate("addQuestionPage");

    expect(mockHandlers.onAddQuestionPage).toHaveBeenCalled();
  });

  it("should allow a section to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="add-menu"]').simulate("addSection");

    expect(mockHandlers.onAddSection).toHaveBeenCalled();
  });

  it("should allow a calculated summary to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="add-menu"]').simulate("addCalculatedSummaryPage");
    expect(mockHandlers.onAddCalculatedSummaryPage).toHaveBeenCalled();
  });

  it("should allow a question confirmation to be added", () => {
    const wrapper = createWrapper();
    wrapper.find('[data-test="add-menu"]').simulate("addQuestionConfirmation");

    expect(mockHandlers.onAddQuestionConfirmation).toHaveBeenCalled();
  });

  it("should be able to open history page", async () => {
    const { getByText, history } = render(<NavigationHeader {...props} />);
    const historyButton = getByText("History");
    fireEvent.click(historyButton);
    expect(history.location.pathname).toMatch("/q/1/history");
  });
});
