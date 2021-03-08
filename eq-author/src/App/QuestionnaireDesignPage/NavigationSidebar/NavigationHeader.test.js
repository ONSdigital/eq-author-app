import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useParams } from "react-router-dom";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

import { CalculatedSummaryPage } from "constants/page-types";

import NavigationHeader from "./NavigationHeader";

function defaultSetup(changes) {
  const props = {
    ...changes,
  };
  const utils = render(<NavigationHeader {...props} />);

  return { ...utils };
}

// import { UnwrappedNavigationHeader as NavigationHeader } from "./NavigationHeader";
describe("NavigationHeader", () => {
  it("should render", () => {
    const { getByTestId } = defaultSetup();
    expect(getByTestId("add-menu")).toBeVisible();
  });
});
// describe("NavigationHeader", () => {
//   const mockHandlers = {
//     onAddQuestionPage: jest.fn(),
//     onAddSection: jest.fn(),
//     onAddQuestionConfirmation: jest.fn(),
//     onAddCalculatedSummaryPage: jest.fn(),
//   };
//   const props = {
//     questionnaire: {},
//     canAddQuestionPage: true,
//     canAddCalculatedSummaryPage: true,
//     canAddQuestionConfirmation: true,
//     onUpdateQuestionnaire: jest.fn(),
//     onCreateQuestionConfirmation: jest.fn(),
//     match: { params: { questionnaireId: "1" } },
//     me: { id: "123", email: "j@h.com", admin: true },
//     ...mockHandlers,
//   };
//   const createWrapper = () => shallow(<NavigationHeader {...props} />);

it("should render", () => {
  //     expect(createWrapper()).toMatchSnapshot();
});

//   // it("should allow a page to be added", () => {
//   //   const wrapper = createWrapper();
//   //   wrapper.find('[data-test="add-menu"]').simulate("addQuestionPage");

//   //   expect(mockHandlers.onAddQuestionPage).toHaveBeenCalled();
//   // });

//   // it("should allow a section to be added", () => {
//   //   const wrapper = createWrapper();
//   //   wrapper.find('[data-test="add-menu"]').simulate("addSection");

//   //   expect(mockHandlers.onAddSection).toHaveBeenCalled();
//   // });

//   // it("should allow a calculated summary to be added", () => {
//   //   const wrapper = createWrapper();
//   //   wrapper.find('[data-test="add-menu"]').simulate("addCalculatedSummaryPage");
//   //   expect(mockHandlers.onAddCalculatedSummaryPage).toHaveBeenCalled();
//   // });

//   // it("should allow a question confirmation to be added", () => {
//   //   const wrapper = createWrapper();
//   //   wrapper.find('[data-test="add-menu"]').simulate("addQuestionConfirmation");

//   //   expect(mockHandlers.onAddQuestionConfirmation).toHaveBeenCalled();
//   // });
// });
