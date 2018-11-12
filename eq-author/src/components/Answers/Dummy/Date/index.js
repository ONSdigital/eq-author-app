import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import DummyTextInput from "components/Answers/Dummy/TextInput";
import placeholder from "./placeholder.svg";

const Field = styled.div`
  display: inline-block;
  margin-left: 1em;
  width: 5em;
  pointer-events: none;

  &:first-of-type {
    margin-left: 0;
  }
`;

const SelectField = styled(Field)`
  width: 12em;
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
        <SelectField data-test="dummy-date-month">
          <Label>Month</Label>
          <Input />
        </SelectField>
      )}
      {showYear && (
        <Field data-test="dummy-date-year">
          <Label>Year</Label>
          <Input />
        </Field>
      )}
    </Wrapper>
  );
};

export default Date;

Date.propTypes = {
  showDay: PropTypes.bool,
  showMonth: PropTypes.bool,
  showYear: PropTypes.bool
};
