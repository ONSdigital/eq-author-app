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
});
