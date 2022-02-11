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
      allowUnanswered
    }
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateValidationRule: ([mutationInput, entity]) => {
    const { id, ...rest } = mutationInput;
    const validationRule = [
      "minValueInput",
      "maxValueInput",
      "earliestDateInput",
      "latestDateInput",
      "minDurationInput",
      "maxDurationInput",
      "totalInput",
    ].find((x) => rest[x]);

    const customAttribute =
      entity?.customDate !== undefined ? "customDate" : "custom";

    const optimisticResponse = {
      updateValidationRule: {
        id,
        ...rest[validationRule],
        enabled: entity?.enabled ?? null,
        metadata: entity?.metadata ?? null,
        [customAttribute]: rest[validationRule]?.custom ?? null,
        previousAnswer: entity?.previousAnswer ?? null,
        validationErrorInfo: {
          id: "id",
          errors: [],
          totalCount: 0,
          __typename: "validationErrorInfo",
        },
      },
    };

    return mutate({
      variables: { input: filter(INPUT_FRAGMENT, mutationInput) },
      optimisticResponse,
    });
  },
});

export default graphql(UPDATE_VALIDATION_RULE, {
  props: mapMutateToProps,
});
