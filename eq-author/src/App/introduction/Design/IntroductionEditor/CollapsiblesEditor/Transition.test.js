import React from "react";
import { shallow } from "enzyme";

import Transition from "./Transition";

describe("Transition", () => {
  it("should render", () => {
    expect(
      shallow(
        <Transition>
          <div />
        </Transition>
      )
    ).toMatchSnapshot();
  });

  it("should set the height on exit so it can animate it out", () => {
    const onExit = shallow(
      <Transition>
        <div />
      </Transition>
    ).prop("onExit");

    const getBoundingClientRectStub = jest.fn().mockReturnValue({ height: 10 });
    const node = {
      style: { height: 0 },
      getBoundingClientRect: getBoundingClientRectStub,
    };

    onExit(node);
    expect(node.style.height).toEqual("10px");
  });
});
