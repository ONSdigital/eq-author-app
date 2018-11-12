import React from "react";
import { shallow } from "enzyme";

import { Select } from "components/MetadataTable/Controls";

const render = (props = {}) => shallow(<Select {...props} />);

describe("Select", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      options: ["x", "y", "z"],
      name: "test",
      value: "x",
      onChange: jest.fn(),
      onUpdate: jest.fn()
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
