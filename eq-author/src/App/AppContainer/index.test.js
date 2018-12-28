import React from "react";

import App, { Routes } from "App/AppContainer";
import { shallow } from "enzyme";

import createHistory from "history/createHashHistory";
import createMockStore from "tests/utils/createMockStore";

const history = createHistory();

const store = createMockStore();

const client = {
  query: jest.fn(),
  readQuery: jest.fn()
};

describe("containers/AppContainer", () => {
  it("should render", () => {
    const wrapper = shallow(
      <App store={store} history={history} client={client} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  describe("Routes", () => {
    it("should render ", () => {
      const wrapper = shallow(<Routes isSignedIn history={history} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
