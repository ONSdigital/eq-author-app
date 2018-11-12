import React from "react";
import { shallow } from "enzyme";

import SidebarButton, {
  Detail as SidebarButtonDetail
} from "components/SidebarButton";
import ModalWithNav from "components/ModalWithNav";
import { UnconnectedAnswerValidation } from "components/Validation/AnswerValidation";

const render = (props, render = shallow) => {
  return render(<UnconnectedAnswerValidation {...props} />);
};

describe("AnswerValidation", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: "Number",
        validation: {
          minValue: {
            enabled: false
          },
          maxValue: {
            enabled: false
          }
        }
      },
      gotoTab: jest.fn()
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

  it("should correctly update state when opening a modal", () => {
    const wrapper = render(props);
    wrapper
      .find(SidebarButton)
      .first()
      .simulate("click");
    expect(wrapper.state("modalIsOpen")).toEqual(true);
  });

  it("should correctly update state when closing a modal", () => {
    const wrapper = render(props);
    wrapper.find(ModalWithNav).simulate("close");
    expect(wrapper.state("modalIsOpen")).toEqual(false);
  });

  it("should render min validation values in the preview", () => {
    const wrapper = render({
      ...props,
      answer: {
        id: "1",
        type: "Number",
        validation: {
          minValue: {
            enabled: true,
            custom: 5
          }
        }
      }
    });

    expect(
      wrapper
        .find(SidebarButtonDetail)
        .at(0)
        .prop("children")
    ).toEqual(5);
  });

  describe("Number/Currency Validation preview", () => {
    describe("max value", () => {
      it("should render custom values", () => {
        const wrapper = type =>
          render({
            ...props,
            answer: {
              id: "1",
              type: type,
              validation: {
                maxValue: {
                  enabled: true,
                  custom: 5
                }
              }
            }
          });

        expect(
          wrapper("Number")
            .find(SidebarButtonDetail)
            .at(0)
            .prop("children")
        ).toMatchSnapshot();

        expect(
          wrapper("Currency")
            .find(SidebarButtonDetail)
            .at(0)
            .prop("children")
        ).toMatchSnapshot();
      });

      it("should render previous answer", () => {
        const wrapper = type =>
          render({
            ...props,
            answer: {
              id: "1",
              type: type,
              validation: {
                maxValue: {
                  enabled: true,
                  previousAnswer: {
                    displayName: "foobar"
                  }
                }
              }
            }
          });

        expect(
          wrapper("Number")
            .find(SidebarButtonDetail)
            .at(0)
            .prop("children")
        ).toMatchSnapshot();

        expect(
          wrapper("Currency")
            .find(SidebarButtonDetail)
            .at(0)
            .prop("children")
        ).toMatchSnapshot();
      });
    });
  });
});
