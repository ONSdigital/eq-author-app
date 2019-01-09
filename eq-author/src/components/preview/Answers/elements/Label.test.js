import { shallow } from "enzyme";
import React from "react";

import Label from "./Label";

describe("Label", () => {
  it("should render", () => {
    expect(
      shallow(<Label description="description">label</Label>)
    ).toMatchSnapshot();
  });

  it("should not render description if not provided", () => {
    expect(shallow(<Label>label</Label>)).toMatchSnapshot();
  });

  it("should render an error when the label is not provided", () => {
    expect(shallow(<Label description="description" />)).toMatchSnapshot();
  });
});
