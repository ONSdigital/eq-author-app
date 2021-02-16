import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import DialogButtons from "./";

const renderButtons = (props) => {
  return render(<DialogButtons {...props} />);
};

describe("Dialog Buttons", () => {
  let props;

  beforeEach(() => {
    props = {
      primaryAction: jest.fn(),
      primaryActionText: "Primary Action",
    };
  });

  it("should render the dialog Buttons", () => {
    const { getByText } = renderButtons(props);
    expect(getByText("Primary Action")).toBeTruthy();
  });

  describe("Invoking dialog button actions", () => {
    let actions;

    beforeEach(() => {
      actions = {
        secondaryAction: jest.fn(),
        secondaryActionText: "Secondary Action",
        tertiaryAction: jest.fn(),
        tertiaryActionText: "Tertiary Action",
      };
    });

    it("should render multiple actions", () => {
      const { getByText } = renderButtons({ ...props, ...actions });
      expect(getByText("Primary Action")).toBeTruthy();
      expect(getByText("Secondary Action")).toBeTruthy();
      expect(getByText("Tertiary Action")).toBeTruthy();
    });

    it("should execute primary action", () => {
      const { getByText } = renderButtons({ ...props, ...actions });

      fireEvent.click(getByText("Primary Action"));
      expect(props.primaryAction).toHaveBeenCalled();
    });

    it("should execute secondary action", () => {
      const { getByText } = renderButtons({ ...props, ...actions });

      fireEvent.click(getByText("Secondary Action"));
      expect(actions.secondaryAction).toHaveBeenCalled();
    });

    it("should execute tertiary action", () => {
      const { getByText } = renderButtons({ ...props, ...actions });

      fireEvent.click(getByText("Tertiary Action"));
      expect(actions.tertiaryAction).toHaveBeenCalled();
    });
  });
});
