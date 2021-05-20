import React from "react";

import App, { Routes } from "./";
import { shallow } from "enzyme";

import { createHashHistory } from "history";

const history = createHashHistory();

const client = {
  query: jest.fn(),
  readQuery: jest.fn(),
};

describe("containers/AppContainer", () => {
  it("should render", () => {
    const wrapper = shallow(<App history={history} client={client} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe("Routes", () => {
    it("should render ", () => {
      const wrapper = shallow(<Routes isSignedIn history={history} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
