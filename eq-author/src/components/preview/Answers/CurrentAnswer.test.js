import { shallow } from "enzyme";
import React from "react";

import CurrencyAnswer from "./CurrencyAnswer";

describe("Currency Answer", () => {
  it("should render", () => {
    const answer = {
      label: "Label",
      description: "Description",
    };

    expect(shallow(<CurrencyAnswer answer={answer} />)).toMatchSnapshot();
  });
});
