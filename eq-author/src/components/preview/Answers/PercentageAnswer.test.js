import React from "react";
import { shallow } from "enzyme";

import PercentageAnswer from "./PercentageAnswer";

describe("Percentage answer preview", () => {
  it("should render", () => {
    const wrapper = shallow(
      <PercentageAnswer
        answer={{ label: "Label", description: "Description" }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
