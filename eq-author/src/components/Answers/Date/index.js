import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import DummyDate from "components/Answers/Dummy/Date";

import { Field, Label } from "components/Forms";
import WrappingInput from "components/WrappingInput";
import withEntityEditor from "components/withEntityEditor";
import answerFragment from "graphql/fragments/answer.graphql";
import styled from "styled-components";
import VisuallyHidden from "../../VisuallyHidden";
import gql from "graphql-tag";
import { colors } from "constants/theme";

const Format = styled.div`
  padding: 1em;
  width: 66.66%;
  border-radius: 3px;
  opacity: 0.5 !important;
  border: 1px solid ${colors.bordersLight};
`;

const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
`;

const Legend = VisuallyHidden.withComponent("legend");

export const UnwrappedDate = ({
  label,
  name,
  answer,
  onChange,
  onUpdate,
  placeholder,
  showDay,
  showMonth,
  showYear
}) => (
  <Fieldset>
    <Legend>Date options</Legend>
    <Field>
      <Label htmlFor={`${name}-${answer.id}`}>{label}</Label>
      <WrappingInput
        id={`${name}-${answer.id}`}
        name={name}
        size="medium"
        onChange={onChange}
        onBlur={onUpdate}
        value={answer.label}
        placeholder={placeholder}
        data-test="date-answer-label"
        data-autofocus
        bold
      />
    </Field>
    <Field>
      <Label>Date</Label>
      <Format>
        <DummyDate
          showDay={showDay}
          showMonth={showMonth}
          showYear={showYear}
        />
      </Format>
    </Field>
  </Fieldset>
);

UnwrappedDate.propTypes = {
  answer: CustomPropTypes.answer.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  showDay: PropTypes.bool,
  showMonth: PropTypes.bool,
  showYear: PropTypes.bool
};

UnwrappedDate.defaultProps = {
  label: "Label",
  name: "label"
};

UnwrappedDate.fragments = {
  Date: gql`
    fragment Date on Answer {
      id
      label
      properties
    }
  `
};

export default withEntityEditor("answer", answerFragment)(UnwrappedDate);
