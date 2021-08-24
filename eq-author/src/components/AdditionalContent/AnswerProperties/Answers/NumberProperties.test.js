import React from "react";
import { render } from "tests/utils/rtl";

import { useMutation } from "@apollo/react-hooks";

import NumberProperties from "./NumberProperties";

const renderNumberProperties = (props = {}) =>
  render(<NumberProperties {...props} />);

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
}));
useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

describe("Required Property", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: "number",
        properties: {
          decimals: 0,
        },
        validationErrorInfo: {
          totalCount: 0,
          errors: [],
          id: "1",
        },
      },
      onBlur: jest.fn(),
      getId: jest.fn(),
    };
  });

  it("should render", () => {
    const { getByTestId } = renderNumberProperties(props);
    expect(getByTestId("number-input")).toBeInTheDocument();
  });

  it("should handle blur event for input", () => {
    const { debug } = renderNumberProperties(props);
    debug();
    // wrapper.simulate("blur", {
    //   target: { answer: { properties: { decimals: 1 } } },
    // });
    // expect(props.onBlur).toHaveBeenCalledWith({
    //   target: { answer: { properties: { decimals: 1 } } },
    // });
  });
});
