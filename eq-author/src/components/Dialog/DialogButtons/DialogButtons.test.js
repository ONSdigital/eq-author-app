import React from "react";
import { shallow } from "enzyme";
import DialogButtons from "components/Dialog/DialogButtons/index";

const createWrapper = (props, render = shallow) => {
  return render(<DialogButtons {...props} />);
};

describe("Dialog buttons", () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      primaryAction: jest.fn(),
      primaryActionText: "Primary action"
    };
    wrapper = createWrapper(props);
  });

  it("should render the dialog buttons", () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe("Invoking dialog button actions", () => {
    let actions;

    beforeEach(() => {
      actions = {
        secondaryAction: jest.fn(),
        secondaryActionText: "Secondary Action",
        tertiaryAction: jest.fn(),
        tertiaryActionText: "Tertiary Action"
      };

      wrapper = createWrapper({ ...props, ...actions }, shallow);
    });

    it("should render multiple actions", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should execute primary action", () => {
      wrapper
        .find("DialogButtons__ActionButton[primary=true]")
        .simulate("click");
      expect(props.primaryAction).toHaveBeenCalled();
    });

    it("should execute secondary action", () => {
      wrapper
        .find("DialogButtons__ActionButton[secondary=true]")
        .simulate("click");
      expect(actions.secondaryAction).toHaveBeenCalled();
    });

    it("should execute tertiary action", () => {
      wrapper
        .find("DialogButtons__ActionButton[tertiary=true]")
        .simulate("click");
      expect(actions.tertiaryAction).toHaveBeenCalled();
    });
  });
});
