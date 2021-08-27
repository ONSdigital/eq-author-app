import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";

import Date from "../Date";
import UPDATE_ANSWER from "graphql/updateAnswer.graphql";
import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import MinDurationValidationRule from "graphql/fragments/min-duration-validation-rule.graphql";
import MaxDurationValidationRule from "graphql/fragments/max-duration-validation-rule.graphql";
import MultiLineField from "components/AdditionalContent/AnswerProperties/Format/MultiLineField";
import AnswerProperties from "components/AdditionalContent/AnswerProperties";
import AdvancedProperties from "components/AdditionalContent/AdvancedProperties";
import AnswerValidation from "App/page/Design/Validation/AnswerValidation";
import Fallback from "components/AdditionalContent/FallbackProperty/Fallback";

const Wrapper = styled.div`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const HorizontalRule = styled.hr`
  margin: 0.2em 0 0.9em;
`;
const DateRange = ({ answer, metadata, ...otherProps }) => {
  const [onUpdateAnswer] = useMutation(UPDATE_ANSWER);
  const onUpdateRequired = ({ value }) => {
    onUpdateAnswer({
      variables: {
        input: {
          id: answer.id,
          properties: { ...answer.properties, required: value },
        },
      },
    });
  };
  const onUpdateFallback = (value) => {
    onUpdateAnswer({
      variables: {
        input: {
          id: answer.id,
          properties: { ...answer.properties, fallback: value },
        },
      },
    });
  };
  return (
    <Wrapper data-test="date-range-editor">
      <Date
        key={`from-${answer.id}`}
        answer={answer}
        name="label"
        showDay
        showMonth
        showYear
        {...otherProps}
      />
      <Date
        key={`to-${answer.id}`}
        answer={answer}
        name="secondaryLabel"
        showDay
        showMonth
        showYear
        {...otherProps}
      />
      <AnswerProperties answer={answer} onUpdateRequired={onUpdateRequired} />
      <AdvancedProperties>
        <HorizontalRule />
        <Container>
          <MultiLineField id="validation-settingd" label="Validation settings">
            <AnswerValidation answer={answer} />
          </MultiLineField>
        </Container>
        <Fallback
          answer={answer}
          metadata={metadata}
          onUpdateFallback={onUpdateFallback}
        />
      </AdvancedProperties>
    </Wrapper>
  );
};

DateRange.propTypes = {
  answer: CustomPropTypes.answer.isRequired,
  onUpdate: PropTypes.func.isRequired,
  metadata: PropTypes.array, //eslint-disable-line
};

DateRange.fragments = {
  DateRange: gql`
    fragment DateRange on Answer {
      id
      ... on BasicAnswer {
        validation {
          ... on DateRangeValidation {
            earliestDate {
              enabled
              ...EarliestDateValidationRule
            }
            latestDate {
              enabled
              ...LatestDateValidationRule
            }
            minDuration {
              enabled
              ...MinDurationValidationRule
            }
            maxDuration {
              enabled
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

export default DateRange;
