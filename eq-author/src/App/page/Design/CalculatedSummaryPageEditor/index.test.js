import React from "react";
import { shallow } from "enzyme";

import { CalculatedSummaryPageEditor } from "./";

jest.mock("components/NavigationCallbacks", () => ({
  useSetNavigationCallbacksForPage: () => null,
}));

describe("CalculatedSummaryPageEditor", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      fetchAnswers: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onChangeUpdate: jest.fn(),
      onUpdateCalculatedSummaryPage: jest.fn(),
      match: {
        params: {
          questionnaireId: "1",
          sectionId: "2",
          pageId: "3",
        },
      },
      questionnaireId: "1",
      page: {
        id: "3",
        title: "",
        alias: "",
        pageType: "CalculatedSummaryPage",
        position: 1,
        displayName: "Foo",
        totalTitle: "",
        folder: {
          id: "folder-1",
          position: 0,
        },
        section: {
          id: "2",
          position: 0,
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

  it("should display the correct error message when the title is missing", async () => {
    defaultProps.page.validationErrorInfo.errors[0] = {
      errorCode: "ERR_VALID_REQUIRED",
      field: "title",
      id: "1",
      type: "pages",
    };

    const wrapper = shallow(<CalculatedSummaryPageEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when piping answer in title is deleted", async () => {
    defaultProps.page.validationErrorInfo.errors[0] = {
      errorCode: "PIPING_TITLE_DELETED",
      field: "title",
      id: "1",
      type: "pages",
    };

    const wrapper = shallow(<CalculatedSummaryPageEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when piping answer in title is moved after This question", async () => {
    defaultProps.page.validationErrorInfo.errors[0] = {
      errorCode: "PIPING_TITLE_MOVED",
      field: "title",
      id: "1",
      type: "pages",
    };

    const wrapper = shallow(<CalculatedSummaryPageEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
