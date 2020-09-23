import React from "react";
import { shallow } from "enzyme";

import PreviousAnswerEditor from "./PreviousAnswerEditor";
import { NUMBER } from "constants/answer-types";

describe("Custom Editor", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: NUMBER,
        properties: {
          unit: null,
        },
      },
      validation: {
        custom: null,
        enabled: true,
        entityType: "Custom",
        id: "0efd3ed1-8e0d-4b0c-9e39-59010751dbdf",
        inclusive: true,
        previousAnswer: null,
        validationErrorInfo: {
          errors: [
            {
              errorCode: "ERR_NO_VALUE",
              field: "custom",
              id: "minValue-0efd3ed1-8e0d-4b0c-9e39-59010751dbdf-custom",
              type: "validation",
            }
          ]
        },
      },
      readKey: "read",
      onChangeUpdate: jest.fn(),
    };
    
    wrapper = shallow(<PreviousAnswerEditor {...props} />);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should trigger onChange when previous answer submitted", () => {
    const event = {
      name: "previousAnswer",
      value: { id: "1" }
    };

    wrapper
      .find("[data-test='content-picker-select']")
      .simulate("submit", event);

    expect(props.onChangeUpdate).toHaveBeenCalledWith(event);
  });
});
