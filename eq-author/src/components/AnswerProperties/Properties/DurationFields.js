import React from "react";

import PropTypes from "prop-types";
import { merge } from "lodash";
import CustomPropTypes from "custom-prop-types";
import { Field, Label } from "components/Forms";

import styled from "styled-components";

import {
  DurationType,
  DurationToggle
} from "components/AnswerProperties/Properties";

const DurationField = styled(Field)`
  margin: 0;
  &:not(:last-child) {
    margin-right: 0.5em;
  }
`;

const Fields = styled.div`
  display: flex;
`;

const DurationFields = ({ answer }) => {
  return (
    <Fields>
      <DurationField>
        <DurationType
          id={`answer-${answer.id}`}
          type={answer.properties.type}
        />
      </DurationField>
      <DurationField>
        <DurationToggle id={`answer-${answer.id}-1`}>Months</DurationToggle>
      </DurationField>
      <DurationField>
        <DurationToggle id={`answer-${answer.id}-2`}>Weeks</DurationToggle>
      </DurationField>
    </Fields>
  );
};

export default DurationFields;
