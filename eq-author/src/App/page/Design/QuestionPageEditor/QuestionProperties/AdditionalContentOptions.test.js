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
      option: "",
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

  it("should be able to display both deleted metadata and deleted answer in piping errors in the description", async () => {
    props.page.validationErrorInfo.errors = [
      {
        errorCode: "PIPING_TITLE_DELETED",
        field: "description",
        id: "1",
        type: "page",
      },
      {
        errorCode: "PIPING_METADATA_DELETED",
        field: "description",
        id: "2",
        type: "page",
      },
    ];
    const wrapper = createWrapper(props);
    expect(wrapper).toMatchSnapshot();
  });
  it("should display the correct error message when piping answer in title is moved after This question", async () => {
    props.page.validationErrorInfo.errors[0] = {
      errorCode: "PIPING_TITLE_MOVED",
      field: "description",
      id: "1",
      type: "pages",
    };
    const wrapper = createWrapper(props);
    expect(wrapper).toMatchSnapshot();
  });
});
