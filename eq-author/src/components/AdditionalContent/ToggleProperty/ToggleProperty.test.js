import React from "react";
import { render, screen, fireEvent } from "tests/utils/rtl";

import ToggleProperty from "components/AdditionalContent/ToggleProperty";

const createWrapper = (props = {}) => render(<ToggleProperty {...props} />);

describe("Toggle property", () => {
  let props;

  beforeEach(() => {
    props = {
      id: "required-toggle",
      value: true,
      onChange: jest.fn(),
    };
    createWrapper(props);
  });

  it("should render", () =>
    expect(screen.getByTestId("required-toggle")).toBeInTheDocument());

  it("should handle change event for input", () => {
    fireEvent.click(screen.getByTestId("required-toggle").children[0]);

    expect(props.onChange).toHaveBeenCalledWith({
      name: "required-toggle",
      value: false,
    });
  });
});
