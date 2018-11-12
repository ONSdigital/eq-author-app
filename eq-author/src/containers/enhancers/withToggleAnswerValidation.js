import { graphql } from "react-apollo";
import gql from "graphql-tag";
import MinValueValidationRule from "graphql/fragments/min-value-validation-rule.graphql";
import MaxValueValidationRule from "graphql/fragments/max-value-validation-rule.graphql";
import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";

export const TOGGLE_VALIDATION_RULE = gql`
  mutation ToggleValidationRule($input: ToggleValidationRuleInput!) {
    toggleValidationRule(input: $input) {
      ...MinValueValidationRule
      ...MaxValueValidationRule
      ...EarliestDateValidationRule
      ...LatestDateValidationRule
    }
  }

  ${MinValueValidationRule}
  ${MaxValueValidationRule}
  ${EarliestDateValidationRule}
  ${LatestDateValidationRule}
`;

export const mapMutateToProps = ({ mutate }) => ({
  onToggleValidationRule: input => mutate({ variables: { input } })
});

export default graphql(TOGGLE_VALIDATION_RULE, {
  props: mapMutateToProps
});
