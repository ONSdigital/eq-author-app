import React from "react";
import { shallow } from "enzyme";

import DefinitionEditor from "./DefinitionEditor";

const createWrapper = props => shallow(<DefinitionEditor {...props} />);

describe("DefinitionEditor", () => {
  let wrapper, props;

  beforeEach(() => {
    props = {
      label: "foobar",
      children: <p>Test</p>
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
