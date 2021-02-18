import React from "react";
import { shallow, mount } from "enzyme";

import CustomEditor from "./CustomEditor";
import { NUMBER } from "constants/answer-types";
import { ERR_NO_VALUE } from "constants/validationMessages";

describe("Custom Editor", () => {
  let props;
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
            },
          ],
        },
      },
      displayName: "foobar",
      readKey: "read",
      testId: "test-id",
      limit: 999,
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onChangeUpdate: jest.fn(),
      onCustomNumberValueChange: jest.fn(),
    };
  });

  it("should render", () => {
    expect(shallow(<CustomEditor {...props} />)).toMatchSnapshot();
  });

  it("should trigger onUpdate when the number input is blurred", () => {
    const wrapper = shallow(<CustomEditor {...props} />);
    wrapper.find("[data-test='numeric-value-input']").simulate("blur");
    expect(props.onUpdate).toHaveBeenCalled();
  });

  it("should display validation message when error present", () => {
    const wrapper = shallow(<CustomEditor {...props} />).find(
      "CustomEditor__StyledError"
    );

    expect(wrapper.text()).toEqual(ERR_NO_VALUE);
  });

  it("should display error styling when error present", () => {
    const wrapper = mount(<CustomEditor {...props} />).find(
      "CustomEditor__StyledNumber"
    );

    expect(wrapper).toHaveStyleRule("border-radius: 4px;");
  });
});
