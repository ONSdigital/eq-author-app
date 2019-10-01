import React from "react";
import { shallow } from "enzyme";
import { render as rtlRender } from "tests/utils/rtl";

import { NUMBER, CURRENCY, PERCENTAGE, UNIT } from "constants/answer-types";
import { CENTIMETRES } from "constants/unit-types";

import SidebarButton, { Detail } from "components/buttons/SidebarButton";
import ModalWithNav from "components/modals/ModalWithNav";
import { UnwrappedAnswerValidation, validationTypes } from "./AnswerValidation";

const render = (props, render = shallow) => {
  return render(<UnwrappedAnswerValidation {...props} />);
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
            validationErrorInfo: { errors: [] },
          },
          maxValue: {
            enabled: false,
            validationErrorInfo: { errors: [] },
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

  it("should correctly update state when opening a Modals", () => {
    const wrapper = render(props);
    wrapper
      .find(SidebarButton)
      .first()
      .simulate("click");
    expect(wrapper.state("modalIsOpen")).toEqual(true);
  });

  it("should correctly update state when closing a Modals", () => {
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

  describe("Numeric answer validation preview", () => {
    const NUMBER_TYPES = [PERCENTAGE, NUMBER, CURRENCY, UNIT];
    const VALIDATIONS = ["maxValue", "minValue"];
    VALIDATIONS.forEach(validation => {
      describe(validation, () => {
        it("should render custom values", () => {
          const wrapper = type => {
            const properties = {};
            if (type === UNIT) {
              properties.unit = CENTIMETRES;
            }
            return render({
              ...props,
              answer: {
                id: "1",
                type: type,
                properties,
                validation: {
                  [validation]: {
                    enabled: true,
                    custom: 5,
                    entityType: "Custom",
                  },
                },
              },
            });
          };

          NUMBER_TYPES.forEach(type => {
            expect(
              wrapper(type)
                .find(SidebarButton)
                .find(Detail)
            ).toMatchSnapshot();
          });
        });

        it("should not render when the custom value is null", () => {
          const wrapper = type =>
            render({
              ...props,
              answer: {
                id: "1",
                type: type,
                validation: {
                  [validation]: {
                    enabled: true,
                    custom: null,
                    entityType: "Custom",
                  },
                },
              },
            });

          NUMBER_TYPES.forEach(type => {
            expect(
              wrapper(type)
                .find(SidebarButton)
                .find(Detail)
            ).toMatchSnapshot();
          });
        });

        it("should render previous answer", () => {
          const wrapper = type =>
            render({
              ...props,
              answer: {
                id: "1",
                type: type,
                validation: {
                  [validation]: {
                    enabled: true,
                    previousAnswer: {
                      displayName: "foobar",
                    },
                  },
                },
              },
            });

          NUMBER_TYPES.forEach(type => {
            expect(
              wrapper(type)
                .find(SidebarButton)
                .find(Detail)
            ).toMatchSnapshot();
          });
        });
      });
    });

    it("should render an error message when min val > max Val", () => {
      const error = [
        {
          errorCode: "ERR_MIN_LARGER_THAN_MAX",
          field: "custom",
          id: "maxValue-0183a9c0-b79f-4766-ba7a-3c3718bb9f26-custom",
          type: "validation",
          __typename: "ValidationError",
        },
      ];
      props.answer.validation.minValue.validationErrorInfo.errors = error;
      props.answer.validation.maxValue.validationErrorInfo.errors = error;

      const { getByText } = rtlRender(<UnwrappedAnswerValidation {...props} />);

      expect(
        getByText("Enter a max value that is greater than min value")
      ).toBeTruthy();
    });
  });
});
