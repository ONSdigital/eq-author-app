import React from "react";
import { shallow } from "enzyme";

import TextAnswer from "./TextAnswer";

describe("TextAnswer", () => {
  it("should render", () => {
    const answer = {
      label: "label",
      description: "description"
    };
    expect(shallow(<TextAnswer answer={answer} />)).toMatchSnapshot();
  });
});
