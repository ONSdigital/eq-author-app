import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import styled from "styled-components";

import Date from "App/questionPage/Design/answers/Date";
import withEntityEditor from "components/withEntityEditor";

import answerFragment from "graphql/fragments/answer.graphql";
import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import MinDurationValidationRule from "graphql/fragments/min-duration-validation-rule.graphql";
import MaxDurationValidationRule from "graphql/fragments/max-duration-validation-rule.graphql";

const Wrapper = styled.div`
  width: 100%;
`;

const DateRange = ({ answer, ...otherProps }) => (
  <Wrapper data-test="date-range-editor">
    <Date
      key={`from-${answer.id}`}
      id={answer.id}
      value={answer.label}
      answer={answer}
      showDay
      showMonth
      showYear
      {...otherProps}
    />
    <Date
      key={`to-${answer.id}`}
      id={answer.id}
      value={answer.secondaryLabel}
      name="secondaryLabel"
      showDay
      showMonth
      showYear
      {...otherProps}
    />
  </Wrapper>
);

DateRange.propTypes = {
  answer: CustomPropTypes.answer.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

DateRange.fragments = {
  DateRange: gql`
    fragment DateRange on Answer {
      id
      ... on BasicAnswer {
        validation {
          ... on DateRangeValidation {
            earliestDate {
              ...EarliestDateValidationRule
            }
            latestDate {
              ...LatestDateValidationRule
            }
            minDuration {
              ...MinDurationValidationRule
            }
            maxDuration {
              ...MaxDurationValidationRule
            }
          }
        }
      }
    }
    ${Date.fragments.Date}
    ${EarliestDateValidationRule}
    ${LatestDateValidationRule}
    ${MinDurationValidationRule}
    ${MaxDurationValidationRule}
  `,
};

export default withEntityEditor("answer", answerFragment)(DateRange);
