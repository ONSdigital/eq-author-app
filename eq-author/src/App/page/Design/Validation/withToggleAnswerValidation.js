import { graphql } from "react-apollo";
import gql from "graphql-tag";

export const TOGGLE_VALIDATION_RULE = gql`
  mutation ToggleValidationRule($input: ToggleValidationRuleInput!) {
    toggleValidationRule(input: $input) {
      id
      enabled
    }
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  onToggleValidationRule: input => mutate({ variables: { input } }),
});

export default graphql(TOGGLE_VALIDATION_RULE, {
  props: mapMutateToProps,
});
