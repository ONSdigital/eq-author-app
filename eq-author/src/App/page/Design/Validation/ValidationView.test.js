import React from "react";
import { shallow } from "enzyme";
import ValidationView from "./ValidationView";

const createWrapper = (props, render = shallow) => {
  return render(<ValidationView {...props} />);
};

const defaultProps = {
  children: <div>Children</div>,
  enabled: true,
  onToggleChange: jest.fn(),
};

describe("ValidationView", () => {
  it("should render children when enabled", () => {
    const props = {
      ...defaultProps,
      enabled: true,
    };
    expect(createWrapper(props)).toMatchSnapshot();
  });

  it("should render disabled messaged when disabled", () => {
    const props = {
      ...defaultProps,
      enabled: false,
    };
    expect(createWrapper(props)).toMatchSnapshot();
  });
});
