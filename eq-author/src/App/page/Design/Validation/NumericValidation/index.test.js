import React from "react";
import { shallow } from "enzyme";

import { NUMBER } from "constants/answer-types";

import UnwrappedNumericValidation from "./";

describe("AnswerValidation", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: NUMBER,
        validation: {
          minValue: {
            enabled: true,
            entityType: "Custom",
            previousAnswer: null,
            validationErrorInfo: {
              errors: [
                {
                  errorCode: "ERR_NO_VALUE",
                  field: "custom",
                  id: "minValue-0efd3ed1-8e0d-4b0c-9e39-59010751dbdf-custom",
                  type: "validation",
                },
              ],
            },
          },
          maxValue: {
            enabled: false,
            validationErrorInfo: { errors: [] },
          },
          validationErrorInfo: {
            errors: [
              {
                errorCode: "ERR_NO_VALUE",
                field: "custom",
                id: "minValue-0efd3ed1-8e0d-4b0c-9e39-59010751dbdf-custom",
                type: "validation",
              },
            ],
          },
        },
      },
      type: "Number",
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onChangeUpdate: jest.fn(),
    };
  });

  it("should render", () => {
    expect(
      shallow(<UnwrappedNumericValidation {...props} />)
    ).toMatchSnapshot();
  });

  // it("should trigger change update when the entity type is changed by the pill tabs", () => {
  //   const wrapper = shallow(<UnwrappedNumericValidation {...props} />);
  //   wrapper.find("[data-test='value-pill-tabs']").simulate("entityTypeChange", {
  //     name: "entityType",
  //     value: "PreviousAnswer",
  //   });

  //   expect(props.onChangeUpdate).toHaveBeenCalledWith({
  //     name: "entityType",
  //     value: "PreviousAnswer",
  //   });
  // });
});
