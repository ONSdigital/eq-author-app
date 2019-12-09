import React from "react";
import { render } from "tests/utils/rtl";
import ToastContainer from ".";

describe("Toastcontainer", () => {
  let props;

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
    expect(
      render(<ToastContainer {...props} />).asFragment()
    ).toMatchSnapshot();
  });
});
