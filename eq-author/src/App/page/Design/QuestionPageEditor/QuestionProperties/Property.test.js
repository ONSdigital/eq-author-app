import React from "react";
import { shallow } from "enzyme";

import Property from "./Property";

const render = (props) => shallow(<Property {...props} />);

describe("Property", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      id: "1",
      children: <div>This is the child component</div>,
      onChange: jest.fn(),
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
