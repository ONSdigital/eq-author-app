import React from "react";
import { shallow } from "enzyme";

import Select from "./Select";

const render = (props = {}) => shallow(<Select {...props} />);

describe("Select", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      options: [
        {
          label: "Option A",
          type: "opt_a",
        },
        {
          label: "Option B",
          type: "opt_b",
        },
        {
          label: "Option C",
          type: "opt_c",
        },
      ],
      name: "test",
      value: "opt_a",
      onChange: jest.fn(),
      onUpdate: jest.fn(),
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
