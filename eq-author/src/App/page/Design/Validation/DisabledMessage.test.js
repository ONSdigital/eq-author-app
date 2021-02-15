import React from "react";
import { shallow } from "enzyme";

import DisabledMessage from "./DisabledMessage";

const render = (props) => shallow(<DisabledMessage {...props} />);

describe("AnswerValidation", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      name: "foobar",
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
