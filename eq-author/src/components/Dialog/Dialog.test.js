import React from "react";
import { shallow } from "enzyme";
import Dialog from "./";

describe("components/Dialog", () => {
  it("should render a dialog", () => {
    const wrapper = shallow(
      <Dialog>
        <div>Dialog content</div>
      </Dialog>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
