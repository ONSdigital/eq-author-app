import React from "react";
import { render } from "tests/utils/rtl";

import Transition from "./Transition";

describe("Transition", () => {
  it("should render", () => {
    expect(
      render(
        <Transition>
          <div />
        </Transition>
      ).asFragment()
    ).toMatchSnapshot();
  });

  it("should set the height on exit so it can animate it out", () => {
    const ref = React.createRef();
    render(
      <Transition ref={ref}>
        <div />
      </Transition>
    );

    const getBoundingClientRectStub = jest.fn().mockReturnValue({ height: 10 });
    const node = {
      style: { height: 0 },
      getBoundingClientRect: getBoundingClientRectStub,
    };
    ref.current.props.onExit()(node);
    expect(getBoundingClientRectStub).toHaveBeenCalled();
  });
});
