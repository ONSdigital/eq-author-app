import React from "react";
import { shallow } from "enzyme";
import ErrorInline from ".";

describe("ErrorInline", () => {
  it("should render", () => {
    expect(shallow(<ErrorInline>Oops</ErrorInline>)).toMatchSnapshot();
  });
});
