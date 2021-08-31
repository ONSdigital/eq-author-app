import React from "react";
import { shallow } from "enzyme";

import { StatelessAdditionalInfo } from "./AdditionalContentOptions";

import { TEXTFIELD } from "constants/answer-types";

const createWrapper = (props) =>
  shallow(<StatelessAdditionalInfo {...props} />);

describe("AdditionalInfo", () => {
  let wrapper, props;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      fetchAnswers: jest.fn(),
      onChangeUpdate: jest.fn(),
      page: {
        id: "1",
        alias: "foobar",
        title: "<p>Hello world</p>",
        description: "<p>Description</p>",
        descriptionEnabled: true,
        guidance: "<p>Guidance</p>",
        guidanceEnabled: true,
        definitionLabel: "<p>Definition Label</p>",
        definitionContent: "<p>Definition Content</p>",
        definitionEnabled: true,
        additionalInfoLabel: "<p>Additional Info Label</p>",
        additionalInfoContent: "<p>Additional Info Content</p>",
        additionalInfoEnabled: true,
        answers: [{ id: "1", type: TEXTFIELD }],
        validationErrorInfo: {
          errors: [],
        },
        section: {
          id: "1",
          questionnaire: {
            id: "1",
            metadata: [],
          },
        },
      },
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when the additional info content is missing", async () => {
    props.page.validationErrorInfo.errors[0] = {
      errorCode: "ERR_VALID_REQUIRED",
      field: "additionalInfoContent",
      id: "1",
      type: "pages",
    };
    const wrapper = createWrapper(props);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when the additional info label is empty", async () => {
    props.page.validationErrorInfo.errors[0] = {
      errorCode: "ERR_VALID_REQUIRED",
      field: "additionalInfoLabel",
      id: "1",
      type: "pages",
    };
    const wrapper = createWrapper(props);
    expect(wrapper).toMatchSnapshot();
  });
});
