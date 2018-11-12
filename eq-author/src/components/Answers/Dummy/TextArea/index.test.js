import React from "react";
import { shallow } from "enzyme";
import TextArea from "./";

let wrapper;

describe("components/Answers/Dummy/TextArea", () => {
  beforeEach(() => {
    wrapper = shallow(<TextArea />);
  });

  it("shoulder render", function() {
    expect(wrapper).toMatchSnapshot();
  });
});
