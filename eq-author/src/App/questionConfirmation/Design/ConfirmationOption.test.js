import React from "react";
import { shallow } from "enzyme";

import { UnwrappedConfirmationOption } from "./ConfirmationOption";

describe("ConfirmationOption", () => {
  it("should render", () => {
    const wrapper = shallow(
      <UnwrappedConfirmationOption
        name="option"
        value={{ label: "label", description: "description" }}
        label="Option label"
        onChange={jest.fn()}
        onUpdate={jest.fn()}
        getValidationError={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
