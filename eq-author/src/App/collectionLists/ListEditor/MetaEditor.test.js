import React from "react";
import { shallow } from "enzyme";

import { StatelessMetaEditor } from "./MetaEditor";

import { TEXTFIELD } from "constants/answer-types";

describe("MetaEditor", () => {
  let props;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      fetchAnswers: jest.fn(),
      onChangeUpdate: jest.fn(),
      getValidationError: jest.fn(),
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
        section: {
          id: "1",
          questionnaire: {
            id: "1",
            metadata: [],
          },
        },
        validationErrorInfo: {
          totalCount: 1,
          errors: [{ errorCode: "ERR_VALID_REQUIRED" }],
        },
      },
    };
  });

  it("should render", () => {
    const wrapper = shallow(<StatelessMetaEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when the title is missing", async () => {
    props.page.validationErrorInfo.errors[0] = {
      errorCode: "ERR_VALID_REQUIRED",
      field: "title",
      id: "1",
      type: "pages",
    };
    const wrapper = shallow(<StatelessMetaEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should be able to display both deleted metadata and deleted answer in piping errors in the title", async () => {
    props.page.validationErrorInfo.errors = [
      {
        errorCode: "PIPING_TITLE_DELETED",
        field: "title",
        id: "1",
        type: "page",
      },
      {
        errorCode: "PIPING_METADATA_DELETED",
        field: "title",
        id: "2",
        type: "page",
      },
    ];
    const wrapper = shallow(<StatelessMetaEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when the definition label is missing", async () => {
    props.page.validationErrorInfo.errors[0] = {
      errorCode: "ERR_VALID_REQUIRED",
      field: "definitionLabel",
      id: "1",
      type: "pages",
    };
    const wrapper = shallow(<StatelessMetaEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when the definition content is missing", async () => {
    props.page.validationErrorInfo.errors[0] = {
      errorCode: "ERR_VALID_REQUIRED",
      field: "definitionContent",
      id: "1",
      type: "pages",
    };
    const wrapper = shallow(<StatelessMetaEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when the description is enabled and empty", async () => {
    props.page.validationErrorInfo.errors[0] = {
      errorCode: "ERR_VALID_REQUIRED",
      field: "description",
      id: "1",
      type: "pages",
    };
    const wrapper = shallow(<StatelessMetaEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when the includes/excludes content is missing", async () => {
    props.page.validationErrorInfo.errors[0] = {
      errorCode: "ERR_VALID_REQUIRED",
      field: "guidance",
      id: "1",
      type: "pages",
    };
    const wrapper = shallow(<StatelessMetaEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when piping answer in title is deleted", async () => {
    props.page.validationErrorInfo.errors[0] = {
      errorCode: "PIPING_TITLE_DELETED",
      field: "title",
      id: "1",
      type: "pages",
    };
    const wrapper = shallow(<StatelessMetaEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should display the correct error message when piping answer in title is moved after This question", async () => {
    props.page.validationErrorInfo.errors[0] = {
      errorCode: "PIPING_TITLE_MOVED",
      field: "title",
      id: "1",
      type: "pages",
    };
    const wrapper = shallow(<StatelessMetaEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
