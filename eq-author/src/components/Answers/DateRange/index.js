import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import styled from "styled-components";

import Date from "components/Answers/Date";

import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";

const Wrapper = styled.div`
  width: 100%;
`;

const DateRange = ({ answer, ...otherProps }) => (
  <Wrapper data-test="date-range-editor">
    {answer.childAnswers.map(answer => (
      <Date
        key={answer.id}
        answer={answer}
        showDay
        showMonth
        showYear
        {...otherProps}
      />
    ))}
  </Wrapper>
);

DateRange.propTypes = {
  answer: CustomPropTypes.answer.isRequired,
  onUpdate: PropTypes.func.isRequired
};

DateRange.fragments = {
  DateRange: gql`
    fragment DateRange on Answer {
      id
      ... on CompositeAnswer {
        validation {
          ... on DateValidation {
            earliestDate {
              ...EarliestDateValidationRule
            }
            latestDate {
              ...LatestDateValidationRule
            }
          }
        }
        childAnswers {
          id
          label
        }
      }
    }
    ${Date.fragments.Date}
    ${EarliestDateValidationRule}
    ${LatestDateValidationRule}
  `
};

export default DateRange;
