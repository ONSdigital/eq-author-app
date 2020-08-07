import React from "react";
import { shallow } from "enzyme";
import { render, flushPromises, act, screen } from "tests/utils/rtl";

import { CalculatedSummaryPageEditor } from "./";

describe("CalculatedSummaryPageEditor", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      fetchAnswers: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onChangeUpdate: jest.fn(),
      onUpdateCalculatedSummaryPage: jest.fn(),
      // getValidationError: jest.fn(),
      match: {
        params: {
          questionnaireId: "1",
          sectionId: "2",
          pageId: "3",
        },
      },
      questionnaireId: "1",
      // };
      page: {
        id: "3",
        title: "",
        alias: "",
        pageType: "CalculatedSummaryPage",
        position: 1,
        displayName: "Foo",
        totalTitle: "",
        section: {
          id: "2",
          displayName: "This Section",
          questionnaire: { id: "1", metadata: [] },
        },
        summaryAnswers: [],
        availableSummaryAnswers: [],
        validationErrorInfo: {
          errors: [],
        },
      },
    };
  });

  it("should render", () => {
    const wrapper = shallow(<CalculatedSummaryPageEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  ////Enzyme test
  it("should display the correct error message when the title is missing", async () => {
    defaultProps.page.validationErrorInfo.errors[0] = {
      errorCode: "ERR_VALID_REQUIRED",
      field: "title",
      id: "1",
      type: "pages",
    };

    const wrapper = shallow(<CalculatedSummaryPageEditor {...defaultProps} />);

    expect(wrapper.text().includes("Enter a calculated summary title")).toBe(
      true
    );
  });

  ///RTL
  it("attempt 2 using RTL - should display the correct error message when the title is missing", async () => {
    defaultProps.page.validationErrorInfo.errors[0] = {
      errorCode: "ERR_VALID_REQUIRED",
      field: "title",
      id: "1",
      type: "pages",
    };

    render(<CalculatedSummaryPageEditor {...defaultProps} />);

    await act(async () => {
      await flushPromises();
    });

    expect(screen.getByText("Enter a calculated summary title")).toBeTruthy();
  });
});
