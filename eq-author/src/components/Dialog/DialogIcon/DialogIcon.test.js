import React from "react";
import { shallow } from "enzyme";
import DialogIcon from "components/Dialog/DialogIcon/index";

const createWrapper = (props, render = shallow) => {
  return render(<DialogIcon {...props} />);
};

describe("components/Dialog/Icon", () => {
  it("should render a move icon", () => {
    expect(createWrapper({ icon: "move" })).toMatchSnapshot();
  });

  it("should render a delete icon", () => {
    expect(createWrapper({ icon: "delete" })).toMatchSnapshot();
  });
});
