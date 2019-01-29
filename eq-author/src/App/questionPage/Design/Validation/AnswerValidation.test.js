import React from "react";
import { shallow } from "enzyme";

import { NUMBER, CURRENCY, PERCENTAGE } from "constants/answer-types";

import SidebarButton, {
  Detail as SidebarButtonDetail,
} from "components/buttons/SidebarButton";
import ModalWithNav from "components/modals/ModalWithNav";
import {
  UnconnectedAnswerValidation,
  validationTypes,
} from "App/questionPage/Design/Validation/AnswerValidation";

const render = (props, render = shallow) => {
  return render(<UnconnectedAnswerValidation {...props} />);
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
          },
          maxValue: {
            enabled: false,
          },
        },
      },
      gotoTab: jest.fn(),
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
    const NUMBER_TYPES = [PERCENTAGE, NUMBER, CURRENCY];
    const VALIDATIONS = ["maxValue", "minValue"];
    VALIDATIONS.forEach(validation => {
      describe(validation, () => {
        it("should render custom values", () => {
          const wrapper = type =>
            render({
              ...props,
              answer: {
                id: "1",
                type: type,
                validation: {
                  [validation]: {
                    enabled: true,
                    custom: 5,
                    entityType: "Custom",
                  },
                },
              },
            });

          NUMBER_TYPES.forEach(type => {
            expect(
              wrapper(type)
                .find(SidebarButtonDetail)
                .at(0)
                .prop("children")
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
            expect(wrapper(type).find(SidebarButtonDetail)).toMatchSnapshot();
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
                .find(SidebarButtonDetail)
                .at(0)
                .prop("children")
            ).toMatchSnapshot();
          });
        });
      });
    });
  });
});
