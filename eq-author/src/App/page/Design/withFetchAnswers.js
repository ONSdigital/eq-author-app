import React from "react";
import { withApollo } from "react-apollo";
import CustomPropTypes from "custom-prop-types";
import { flowRight } from "lodash";

import getAnswersQuery from "graphql/getAnswers.graphql";

export const UnwrappedWithFetchAnswers = (WrappedComponent) => {
  return class extends React.Component {
    static propTypes = {
      client: CustomPropTypes.apolloClient.isRequired,
    };

    fetchAnswers = (ids) => {
      return this.props.client
        .query({ query: getAnswersQuery, variables: { ids } })
        .then(({ data: { answers } }) => answers);
    };

    render() {
      return (
        <WrappedComponent fetchAnswers={this.fetchAnswers} {...this.props} />
      );
    }
  };
};

export default flowRight(withApollo, UnwrappedWithFetchAnswers);
