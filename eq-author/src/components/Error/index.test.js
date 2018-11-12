import React from "react";
import { shallow } from "enzyme";
import Error from ".";

describe("Error", () => {
  it("should render", () => {
    expect(shallow(<Error>Oops</Error>)).toMatchSnapshot();
  });
});
