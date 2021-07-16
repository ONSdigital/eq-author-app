import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { enableOn } from "utils/featureFlags";


import DummyTextInput from "../TextInput";
import placeholder from "../placeholder.svg";

const Field = styled.div`
  display: inline-block;
  margin-left: 1em;
  width: 5em;
  pointer-events: none;

  &:first-of-type {
    margin-left: 0;
  }
`;

const YearField = styled(Field)`
    width: ${props => props.enableOn ? '6em' : '5em'};
`;

const SelectField = styled(Field)`
  width: ${props => props.enableOn ? '5em' : '12em'};
`;

const Input = styled(DummyTextInput)`
  width: 100%;
  background: transparent url(${placeholder}) no-repeat;
  background-size: 100% 100%;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
`;

const Label = styled.p`
  font-size: 0.9em;
  margin: 0 0 0.5rem;
  font-weight: bold;
`;

const Date = ({ showDay, showMonth, showYear }) => {
  return (
    <Wrapper data-test="dummy-date">
      {showDay && (
        <Field data-test="dummy-date-day">
          <Label>Day</Label>
          <Input />
        </Field>
      )}
      {showMonth && (
        <SelectField data-test="dummy-date-month" enableOn={enableOn(["hub"])}>
          <Label>Month</Label>
          <Input />
        </SelectField>
      )}
      {showYear && (
        <YearField data-test="dummy-date-year" enableOn={enableOn(["hub"])}>
          <Label>Year</Label>
          <Input />
        </YearField>
      )}
    </Wrapper>
  );
};

export default Date;

Date.propTypes = {
  showDay: PropTypes.bool,
  showMonth: PropTypes.bool,
  showYear: PropTypes.bool,
};
