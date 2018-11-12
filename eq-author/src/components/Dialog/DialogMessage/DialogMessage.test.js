import React from "react";
import { shallow } from "enzyme";
import DialogMessage from "components/Dialog/DialogMessage/index";

describe("DialogMessage", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <DialogMessage
        heading="Dialog Title"
        subheading="Dialog subheading"
        description="Dialog description"
      />
    );
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
