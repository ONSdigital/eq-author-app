import React from "react";
import { shallow } from "enzyme";

import MetadataEditor from "./MetadataEditor";

describe("Metadata Editor", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      onChangeUpdate: jest.fn(),
      validation: {
        id: "0efd3ed1-8e0d-4b0c-9e39-59010751dbdf",
        previousAnswer: {
          displayName: "test",
        },
        validationErrorInfo: {
          errors: [],
        },
      },
      answer: {
        id: "1",
      },
      readKey: "read",
    };

    wrapper = shallow(<MetadataEditor {...props} />);
  });

  it("Should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly handle metadata change", () => {
    const metadataDateField = wrapper.find(
      "[data-test='metadata-date-editor']"
    );

    const metadata = {
      id: 1,
    };

    metadataDateField.simulate("submit", {
      name: "metadata",
      value: metadata,
    });

    expect(props.onChangeUpdate).toHaveBeenCalledWith({
      name: "metadata",
      value: metadata,
    });
  });

  it("should not display validation error in the modal when there are no errors", () => {
    const validationMessage = wrapper.find("[data-test='date-required-error']");
    expect(validationMessage.exists()).toBeFalsy();
  });

  it("should display validation error in the modal when there is an error", () => {
    const props = {
      onChangeUpdate: jest.fn(),
      validation: {
        id: "1",
        validationErrorInfo: {
          errors: [{ id: "1", errorCode: "ERR_NO_VALUE" }],
        },
      },
      answer: {
        id: "1",
      },
    };
    wrapper = shallow(<MetadataEditor {...props} />);
    const validationMessage = wrapper.find(
      "[data-test='metadata-required-error']"
    );
    expect(validationMessage.exists()).toBeTruthy();
  });

  it("should only display validation errors with the error code `ERR_NO_VALUE`", () => {
    const props = {
      onChangeUpdate: jest.fn(),
      validation: {
        id: "1",
        validationErrorInfo: {
          errors: [{ id: "1", errorCode: "NOT_ERR_NO_VALUE" }],
        },
      },
      answer: {
        id: "1",
      },
    };
    wrapper = shallow(<MetadataEditor {...props} />);
    const validationMessage = wrapper.find(
      "[data-test='metadata-required-error']"
    );
    expect(validationMessage.exists()).toBeFalsy();
  });
});
