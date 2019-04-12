import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { filter } from "graphql-anywhere";

import MinValueValidationRule from "graphql/fragments/min-value-validation-rule.graphql";
import MaxValueValidationRule from "graphql/fragments/max-value-validation-rule.graphql";
import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import MinDurationValidationRule from "graphql/fragments/min-duration-validation-rule.graphql";
import MaxDurationValidationRule from "graphql/fragments/max-duration-validation-rule.graphql";

export const UPDATE_VALIDATION_RULE = gql`
  mutation updateValidationRule($input: UpdateValidationRuleInput!) {
    updateValidationRule(input: $input) {
      ...MinValueValidationRule
      ...MaxValueValidationRule
      ...EarliestDateValidationRule
      ...LatestDateValidationRule
      ...MinDurationValidationRule
      ...MaxDurationValidationRule
    }
  }

  ${MinValueValidationRule}
  ${MaxValueValidationRule}
  ${EarliestDateValidationRule}
  ${LatestDateValidationRule}
  ${MinDurationValidationRule}
  ${MaxDurationValidationRule}
`;

const INPUT_FRAGMENT = gql`
  {
    id
    minValueInput {
      inclusive
      custom
      entityType
      previousAnswer
    }
    maxValueInput {
      inclusive
      custom
      entityType
      previousAnswer
    }
    earliestDateInput {
      offset {
        value
        unit
      }
      relativePosition
      entityType
      custom
      previousAnswer
      metadata
    }
    latestDateInput {
      offset {
        value
        unit
      }
      relativePosition
      entityType
      custom
      previousAnswer
      metadata
    }
    minDurationInput {
      duration {
        value
        unit
      }
    }
    maxDurationInput {
      duration {
        value
        unit
      }
    }
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateAnswerValidation: input =>
    mutate({
      variables: { input: filter(INPUT_FRAGMENT, input) },
    }),
});

export default graphql(UPDATE_VALIDATION_RULE, {
  props: mapMutateToProps,
});
