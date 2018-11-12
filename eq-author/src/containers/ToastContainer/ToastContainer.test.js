import React from "react";
import { shallow } from "enzyme";
import { ToastArea, UndoButton } from "./index";

describe("Toastcontainer", () => {
  let props;

  const createWrapper = (props, render = shallow) => {
    return render(<ToastArea {...props} />);
  };

  beforeEach(() => {
    const dismissToast = jest.fn();

    const undoToast = jest.fn();

    props = {
      id: "Toast_1",
      toasts: {
        toast1: {
          message: "Hello world",
          undoAction: "undoAction",
          context: {
            sectionId: 1,
            pageId: 1
          }
        }
      },
      dismissToast,
      undoToast
    };
  });

  it("should render", () => {
    const wrapper = createWrapper({ ...props }, shallow);
    expect(wrapper).toMatchSnapshot();
  });

  it("should not render the undo button if no undoaction", () => {
    props.toasts.toast1.undoAction = null;
    const wrapper = createWrapper({ ...props }, shallow);
    expect(wrapper.find(UndoButton)).toHaveLength(0);
  });
});
