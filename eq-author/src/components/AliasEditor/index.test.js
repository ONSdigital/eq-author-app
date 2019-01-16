import React from "react";
import { shallow } from "enzyme";
import AliasEditor from "./";

const createWrapper = (props = {}, render = shallow) => {
  return render(<AliasEditor {...props} />);
};

describe("AliasEditor", () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      alias: "FooBar",
      onChange: jest.fn(),
      onUpdate: jest.fn(),
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
