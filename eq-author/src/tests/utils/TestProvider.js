import React from "react";
import PropTypes from "prop-types";
import { MockedProvider } from "@apollo/react-testing";
import { Provider } from "react-redux";
import Toasts from "components/Toasts";

const TestProvider = ({ reduxProps, apolloProps, children }) => (
  <Provider store={reduxProps.store}>
    <MockedProvider mocks={apolloProps.mocks} addTypename>
      <Toasts>{children}</Toasts>
    </MockedProvider>
  </Provider>
);

TestProvider.propTypes = {
  reduxProps: PropTypes.shape({
    store: Provider.propTypes.store,
  }),
  apolloProps: PropTypes.shape({
    mocks: PropTypes.array.isRequired, // eslint-disable prop-types
  }),
  children: PropTypes.node.isRequired,
};

export default TestProvider;
