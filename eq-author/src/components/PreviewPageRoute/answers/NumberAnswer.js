import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { Field, Input, Label } from "./elements";
import { colors } from "constants/theme";
import { merge, get } from "lodash";
import { connect } from "react-redux";

const InputType = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 20em;
`;

const Type = styled.div`
  display: inline-block;
  background-color: ${colors.lighterGrey};
  border-left: 1px solid ${colors.grey};
  border-radius: 0 3px 3px 0;
  padding: 0.6em 1em;
  font-weight: 600;
  font-size: 1em;
  text-align: center;
  line-height: normal;
  position: absolute;
  right: 1px;
  top: 1px;
  z-index: 4;
  text-decoration: none;
`;

const UnwrappedNumberAnswer = ({ answer }) => {
  const { char } = answer.properties.unit;

  return (
    <Field>
      <Label description={answer.description}>{answer.label}</Label>
      <InputType>
        <Input type="text" />
        {char && <Type dangerouslySetInnerHTML={{ __html: char }} />}
      </InputType>
    </Field>
  );
};

const mapStateToProps = (state, ownProps) => ({
  answer: merge({}, ownProps.answer, {
    // properties: getUnit(state, ownProps.answer.id, ownProps.answer.type),
    properties: state.answer[ownProps.answer.id]
  })
});

const NumberAnswer = connect(mapStateToProps)(UnwrappedNumberAnswer);

NumberAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string
  }).isRequired
};

export default NumberAnswer;
