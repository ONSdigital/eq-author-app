import React from "react";
import { shallow } from "enzyme";
import { render as rtlRender } from "tests/utils/rtl";

import {
  NUMBER,
} from "constants/answer-types";

import ModalWithNav from "components/modals/ModalWithNav";
import AnswerValidation, {
  validationTypes,
  SidebarValidation,
} from "../AnswerValidation";

const render = (props, render = shallow) => {
  return render(<AnswerValidation {...props} />);
};

describe("AnswerValidation", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: NUMBER,
        validation: {
          minValue: {
            enabled: false,
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
              }
            ]
          },
        },
      },
    };
  });

  it("should render", () => {
    expect(render(props)).toMatchSnapshot();
  });

  it("should not render when there are no valid validation types", () => {
    props.answer.type = "Radio";
    expect(render(props)).toMatchSnapshot();
  });

  it("should correctly initialise state", () => {
    const wrapper = render(props);
    expect(wrapper.state("modalIsOpen")).toEqual(false);
  });

  it("should correctly update state when opening a Modal", () => {
    const wrapper = render(props);
    wrapper
      .find(SidebarValidation)
      .first()
      .simulate("click");
    expect(wrapper.state("modalIsOpen")).toEqual(true);
  });

  it("should correctly update state when closing a Modal", () => {
    const wrapper = render(props);
    wrapper.find(ModalWithNav).simulate("close");
    expect(wrapper.state("modalIsOpen")).toEqual(false);
  });

  describe("validation object array", () => {
    validationTypes.forEach(validationType => {
      it(`should render the ${validationType.title} validation`, () => {
        const wrapper = shallow(validationType.render());

        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
