import React from "react";
import { shallow } from "enzyme";

import ContentWrapper from "./ContentWrapper";

describe("Content Wrapper", () => {
  const props = {
    onClose: () => {},
  };

  it("should wrap the tab content with a column, transition and close button", () => {
    const wrapper = shallow(
      <ContentWrapper {...props}>
        <h1>hello</h1>
      </ContentWrapper>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should trigger the onClose when the done button is clicked", () => {
    const stubOnClose = jest.fn();
    const wrapper = shallow(
      <ContentWrapper {...props} onClose={stubOnClose}>
        <h1>Hello</h1>
      </ContentWrapper>
    );
    wrapper.find(`[data-test="btn-done"]`).simulate("click");
    expect(stubOnClose).toHaveBeenCalledTimes(1);
  });
});
