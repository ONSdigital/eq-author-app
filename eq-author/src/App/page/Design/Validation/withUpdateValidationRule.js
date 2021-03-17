import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { filter } from "graphql-anywhere";

import MinValueValidationRule from "graphql/fragments/min-value-validation-rule.graphql";
import MaxValueValidationRule from "graphql/fragments/max-value-validation-rule.graphql";
import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import MinDurationValidationRule from "graphql/fragments/min-duration-validation-rule.graphql";
import MaxDurationValidationRule from "graphql/fragments/max-duration-validation-rule.graphql";
import TotalValidationRule from "graphql/fragments/total-validation-rule.graphql";

export const UPDATE_VALIDATION_RULE = gql`
  mutation updateValidationRule($input: UpdateValidationRuleInput!) {
    updateValidationRule(input: $input) {
      ...MinValueValidationRule
      ...MaxValueValidationRule
      ...EarliestDateValidationRule
      ...LatestDateValidationRule
      ...MinDurationValidationRule
      ...MaxDurationValidationRule
      ...TotalValidationRule
    }
  }

  ${MinValueValidationRule}
  ${MaxValueValidationRule}
  ${EarliestDateValidationRule}
  ${LatestDateValidationRule}
  ${MinDurationValidationRule}
  ${MaxDurationValidationRule}
  ${TotalValidationRule}
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
    totalInput {
      entityType
      custom
      previousAnswer
      condition
    }
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateValidationRule: ({ id, ...rest }) => {
    const input = { id, ...rest };
    const validationRule = rest[Object.keys(rest)[0]];
    return mutate({
      variables: { input: filter(INPUT_FRAGMENT, input) },
      optimisticResponse: {
        updateValidationRule: {
          id,
          ...validationRule,
        },
      },
    });
  },
});

export default graphql(UPDATE_VALIDATION_RULE, {
  props: mapMutateToProps,
});
