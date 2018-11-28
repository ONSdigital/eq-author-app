import { shallow } from "enzyme";
import React from "react";

import DateRangeAnswer from "./DateRangeAnswer";

describe("DateRangeAnswer", () => {
  const answer = {
    properties: {
      format: "dd/mm/yyyy"
    },
    childAnswers: [
      {
        label: "from",
        properties: {}
      },
      {
        label: "to",
        properties: {}
      }
    ]
  };

  it("should render", () => {
    expect(shallow(<DateRangeAnswer answer={answer} />)).toMatchSnapshot();
  });
});
