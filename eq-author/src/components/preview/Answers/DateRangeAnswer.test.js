import { shallow } from "enzyme";
import React from "react";

import DateRangeAnswer from "./DateRangeAnswer";

describe("DateRangeAnswer", () => {
  const answer = {
    label: "from",
    secondaryLabel: "to",
    properties: {
      format: "dd/mm/yyyy",
    },
  };

  it("should render", () => {
    expect(shallow(<DateRangeAnswer answer={answer} />)).toMatchSnapshot();
  });
});
