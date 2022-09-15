import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { Field, Input, Label } from "./elements";

const DateInput = styled(Input)`
  width: 100%;
`;

const DateFields = styled.div`
  display: flex;
  flex-direction: row;
`;

const DateField = styled.div`
  margin-right: 1em;
  flex: 1 1 0;
`;

const DayDateField = styled(DateField)`
  max-width: 5em;
`;

const MonthDateField = styled(DateField)`
  flex: 2;
  max-width: 5em;
`;

const YearDateField = styled(DateField)`
  max-width: 6em;
  margin-right: 0;
`;

const DateFieldLabel = styled.label`
  display: block;
  margin-bottom: 0.4em;
  font-weight: 600;
  font-size: 0.8em;
  line-height: 1.4;
`;

const DateAnswer = ({ answer }) => {
  const {
    label,
    description,
    properties: { format = "dd/mm/yyyy" },
  } = answer;

  return (
    <Field>
      <Label description={description}>{label}</Label>
      <DateFields>
        {format.includes("dd") && (
          <DayDateField data-test="day-input">
            <DateFieldLabel>Day</DateFieldLabel>
            <DateInput placeholder="DD" />
          </DayDateField>
        )}

        {format.includes("mm") && (
          <MonthDateField data-test="month-input">
            <DateFieldLabel>Month</DateFieldLabel>
            <DateInput placeholder="MM" />
          </MonthDateField>
        )}

        <YearDateField>
          <DateFieldLabel>Year</DateFieldLabel>
          <DateInput placeholder="YYYY" />
        </YearDateField>
      </DateFields>
    </Field>
  );
};

DateAnswer.propTypes = {
  answer: PropTypes.shape({
    label: PropTypes.string,
    description: PropTypes.string,
    properties: PropTypes.shape({
      format: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default DateAnswer;
