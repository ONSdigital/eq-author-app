import React from "react";
import { shallow } from "enzyme";
import TextInput from "./";

let wrapper;

describe("components/Answers/Dummy/TextInput", () => {
  beforeEach(() => {
    wrapper = shallow(<TextInput />);
  });

  it("shoulder render", function() {
    expect(wrapper).toMatchSnapshot();
  });
});
