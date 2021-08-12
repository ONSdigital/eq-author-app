import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";
import { Column } from "components/Grid";

import Collapsible from "components/Collapsible";
import IconText from "components/IconText";

import { ToggleProperty } from "../Properties";

import ValidationErrorIcon from "../../validation-warning-icon.svg?inline";
import InlineField from "../../InlineField";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";
import Decimal from "../../Decimal";

import { characterErrors } from "constants/validationMessages";

const ValidationWarning = styled(IconText)`
  color: ${colors.red};
  margin-top: 0.5em;
  justify-content: normal;
`;

const NumberProperties = ({
  hasDecimalInconsistency,
  handleChange,
  id,
  answer,
}) => (
  <Collapsible title="Number properties" withoutHideThis variant="content">
    <Column cols={3} gutters={true}>
      <InlineField id={id} label={"Required"}>
        <ToggleProperty
          data-test="answer-properties-required-toggle"
          id={id}
          onChange={handleChange}
          value={answer.properties.required}
        />
      </InlineField>
    </Column>
    <Column cols={6} gutters={false}>
      <InlineField id={id} label={"Decimals"}>
        <Decimal
          id={id}
          data-test="decimals"
          onBlur={(decimals) => {
            handleChange(answer.type, {
              decimals,
            });
          }}
          value={answer.properties.decimals}
          hasDecimalInconsistency={hasDecimalInconsistency}
        />
      </InlineField>
    </Column>
    {hasDecimalInconsistency && (
      <ValidationWarning icon={ValidationErrorIcon}>
        {characterErrors.DECIMAL_MUST_BE_SAME}
      </ValidationWarning>
    )}
    <AnswerValidation answer={answer} />
  </Collapsible>
);

NumberProperties.propTypes = {
  id: PropTypes.string,
  hasDecimalInconsistency: PropTypes.bool,
  handleChange: PropTypes.func,
  answer: PropTypes.object, //eslint-disable-line
};

export default NumberProperties;
