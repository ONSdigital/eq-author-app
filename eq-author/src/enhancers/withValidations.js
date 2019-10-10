import React from "react";
import { getOr } from "lodash/fp";
import { Subscription } from "react-apollo";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

export default (Component, VALIDATION_QUERY) => {
  const WrappedComponent = props => (
    <Subscription
      subscription={VALIDATION_QUERY}
      variables={{ id: props.match.params.questionnaireId }}
    >
      {subscriptionProps => {
        return (
          <Component
            {...props}
            validations={getOr(subscriptionProps, "data.validationUpdated")}
          />
        );
      }}
    </Subscription>
  );
  WrappedComponent.displayName = `withValidations(${Component.displayName})`;
  WrappedComponent.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  return withRouter(WrappedComponent);
};
