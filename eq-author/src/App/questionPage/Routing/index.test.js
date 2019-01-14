import React from "react";
import { shallow } from "enzyme";

import Loading from "components/Loading";
import Error from "components/Error";

import RoutingPage from "./RoutingPage";

import { UnwrappedQuestionRoutingRoute } from "./";

describe("Question Routing Route", () => {
  it("should render a loading icon when loading", () => {
    const wrapper = shallow(<UnwrappedQuestionRoutingRoute loading />);
    expect(wrapper.find(Loading).exists()).toBe(true);
  });

  it("should show an error when there is a server error", () => {
    const wrapper = shallow(
      <UnwrappedQuestionRoutingRoute
        loading={false}
        error={{ message: "Oh no" }}
      />
    );
    expect(wrapper.find(Error).exists()).toBe(true);
  });

  it("should render an error when there is no data", () => {
    const wrapper = shallow(
      <UnwrappedQuestionRoutingRoute loading={false} data={undefined} />
    );
    expect(wrapper.find(Error).exists()).toBe(true);
  });

  it("should render the RoutingPage when data is loaded", () => {
    const questionPage = {
      id: "1",
      displayName: "Untitled Page",
      routing: null,
    };
    const wrapper = shallow(
      <UnwrappedQuestionRoutingRoute
        loading={false}
        data={{
          questionPage,
        }}
      />
    );
    expect(wrapper.find(RoutingPage).exists()).toBe(true);
    expect(wrapper.find(RoutingPage).props()).toMatchObject({
      page: questionPage,
    });
  });
});
