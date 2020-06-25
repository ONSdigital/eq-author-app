import React from "react";
import { shallow } from "enzyme";

import { UnwrappedSkipLogicPage as SkipLogicPage } from "./";

import NoRouting from "./NoRouting";
import SkipLogicEditor from "./SkipLogicEditor";

describe("Routing Page", () => {
  it("should show the no routing message when there is no routing for a page", () => {
    const wrapper = shallow(
      <SkipLogicPage
        page={{ id: "1", displayName: "test", skipConditions: null }}
        createSkipCondition={jest.fn()}
      />
    );
    expect(wrapper.find(NoRouting).exists()).toBe(true);
  });

  it("should call create routing with the page id when add routing button is clicked", () => {
    const createSkipCondition = jest.fn();
    const wrapper = shallow(
      <SkipLogicPage
        page={{ id: "1", displayName: "test", routing: null }}
        createSkipCondition={createSkipCondition}
      />
    );
    wrapper.find(NoRouting).simulate("addRouting");
    expect(createSkipCondition).toHaveBeenCalledWith("1");
  });

  it("should render the editor when there is a routing", () => {
    const routing = { id: "2", rules: [] };
    const wrapper = shallow(
      <SkipLogicPage
        page={{ id: "1", displayName: "test", routing }}
        createSkipCondition={jest.fn()}
      />
    );

    expect(wrapper.find(SkipLogicEditor).exists()).toBe(true);
    expect(wrapper.find(SkipLogicEditor).props()).toMatchObject({
      routing,
    });
  });
});
