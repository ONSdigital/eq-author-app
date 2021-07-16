import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { Field, Input, Label } from "./elements";
import { enableOn } from "utils/featureFlags";
import iconSelect from "./icon-select.svg";
import { colors } from "constants/theme";

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
  max-width: ${props => props.enableOn ? '5em' : '6em'};
`;

const MonthDateField = styled(DateField)`
  flex: 2;
  max-width: ${props => props.enableOn ? '5em' : '15em'};
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

const Select = styled.select`
  display: block;
  color: inherit;
  border-right: 1px solid ${colors.grey};
  border-radius: 3px;
  transition: border-color 0.2s ease-in;
  appearance: none;
  padding: 0.6em 2em 0.6em 0.5em;
  background: white url(${iconSelect}) no-repeat center right 10px;
  background-size: 1em;
  line-height: 1.25em;
  font-size: 1em;
  width: 100%;
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
          <DayDateField data-test="day-input" enableOn={enableOn(["hub"])}>
            <DateFieldLabel>Day</DateFieldLabel>
            <DateInput placeholder="DD" />
          </DayDateField>
        )}

        {format.includes("mm") && (
          <MonthDateField data-test="month-input" enableOn={enableOn(["hub"])}>
            <DateFieldLabel>Month</DateFieldLabel>
              {enableOn(["hub"]) ? 
                  <DateInput placeholder="MM" /> : 
                  <Select>
                    <option value="">Select month</option>
                  </Select>
              }
          </MonthDateField>
        )}

        <YearDateField enableOn={enableOn(["hub"])}>
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
