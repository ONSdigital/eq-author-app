import React from "react";
import { shallow } from "enzyme";

import MultipleFieldEditor from "./MultipleFieldEditor";

const createWrapper = (props) => shallow(<MultipleFieldEditor {...props} />);

describe("MultipleFieldEditor", () => {
  let wrapper, props;

  beforeEach(() => {
    props = {
      label: "foobar",
      children: <p>Test</p>,
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
