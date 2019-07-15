import React from "react";
import { shallow } from "enzyme";
import ToastContainer from ".";

describe("Toastcontainer", () => {
  let props;

  const createWrapper = (props, render = shallow) => {
    return render(<ToastContainer {...props} />);
  };

  beforeEach(() => {
    const onDismissToast = jest.fn();

    props = {
      id: "Toast_1",
      toasts: [
        {
          id: 1,
          message: "Hello world",
        },
      ],
      onDismissToast,
    };
  });

  it("should render", () => {
    const wrapper = createWrapper({ ...props }, shallow);
    expect(wrapper).toMatchSnapshot();
  });
});
