import React from "react";
import { shallow } from "enzyme";

import { UnwrappedRoutingPage as RoutingPage } from "./";

import NoRouting from "./NoRouting";
import RoutingEditor from "./RoutingEditor";

describe("Routing Page", () => {
  it("should show the no routing message when there is no routing for a page", () => {
    const wrapper = shallow(
      <RoutingPage
        page={{ id: "1", displayName: "test", routing: null }}
        createRouting={jest.fn()}
      />
    );
    expect(wrapper.find(NoRouting).exists()).toBe(true);
  });

  it("should call create routing with the page id when add routing button is clicked", () => {
    const createRouting = jest.fn();
    const wrapper = shallow(
      <RoutingPage
        page={{ id: "1", displayName: "test", routing: null }}
        createRouting={createRouting}
      />
    );
    wrapper.find(NoRouting).simulate("addRouting");
    expect(createRouting).toHaveBeenCalledWith("1");
  });

  it("should render the editor when there is a routing", () => {
    const routing = { id: "2", rules: [] };
    const wrapper = shallow(
      <RoutingPage
        page={{ id: "1", displayName: "test", routing }}
        createRouting={jest.fn()}
      />
    );

    expect(wrapper.find(RoutingEditor).exists()).toBe(true);
    expect(wrapper.find(RoutingEditor).props()).toMatchObject({
      routing,
    });
  });
});
