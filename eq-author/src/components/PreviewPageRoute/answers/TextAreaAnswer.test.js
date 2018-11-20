import React from "react";
import { shallow } from "enzyme";

import TextAreaAnswer from "./TextAreaAnswer";

describe("TextAnswer", () => {
  it("should render", () => {
    const answer = {
      label: "label",
      description: "description"
    };
    expect(shallow(<TextAreaAnswer answer={answer} />)).toMatchSnapshot();
  });
});
