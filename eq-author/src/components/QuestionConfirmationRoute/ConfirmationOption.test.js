import React from "react";
import { shallow } from "enzyme";

import ConfirmationOption from "./ConfirmationOption";

describe("ConfirmationOption", () => {
  it("should render", () => {
    const wrapper = shallow(
      <ConfirmationOption
        name="option"
        value={{ label: "label", description: "description" }}
        label="Option label"
        onChange={jest.fn()}
        onUpdate={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
