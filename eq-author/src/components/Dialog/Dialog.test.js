import React from "react";
import { shallow } from "enzyme";
import Dialog from "components/Dialog";

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
