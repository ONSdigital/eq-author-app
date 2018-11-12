import React from "react";
import { mount } from "enzyme";
import ScaleTransition from "./ScaleTransition";

describe("components/Popout/ScaleTransition", () => {
  let component;

  beforeEach(() => {
    component = mount(
      <ScaleTransition>
        <div>hello world</div>
      </ScaleTransition>
    );
  });

  it("should render", () => {
    expect(component).toMatchSnapshot();
  });
});
