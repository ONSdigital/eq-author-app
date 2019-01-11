import React from "react";
import { shallow } from "enzyme";
import { ToastArea } from "./";

describe("Toastcontainer", () => {
  let props;

  const createWrapper = (props, render = shallow) => {
    return render(<ToastArea {...props} />);
  };

  beforeEach(() => {
    const dismissToast = jest.fn();

    props = {
      id: "Toast_1",
      toasts: {
        toast1: {
          message: "Hello world",
          context: {
            sectionId: 1,
            pageId: 1,
          },
        },
      },
      dismissToast,
    };
  });

  it("should render", () => {
    const wrapper = createWrapper({ ...props }, shallow);
    expect(wrapper).toMatchSnapshot();
  });
});
