import React from "react";
import { configure, addDecorator } from "@storybook/react";
import { withOptions } from "@storybook/addon-options";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { noop as mockReducer } from "lodash/fp";

import App from "components/BaseLayout/App";

addDecorator(story => <App>{story()}</App>);

const mockStore = createStore(mockReducer);

addDecorator(story => <Provider store={mockStore}>{story()}</Provider>);

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

function loadStories() {
  requireAll(require.context("../src/components", true, /[/.]story\.js$/));
}

withOptions({
  name: "My Storybook",
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true,
  sortStoriesByKind: true,
});

configure(loadStories, module);
