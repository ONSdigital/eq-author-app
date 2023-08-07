import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { filter } from "lodash";
import { radius } from "constants/theme";
import { decimalErrors } from "constants/validationMessages";
import ValidationError from "components/ValidationError";

import Number, { NumberInput } from "components/Forms/Number";

const SmallerNumber = styled(Number)`
  width: 7em;
  margin-left: 0;

  ${NumberInput} {
    border-radius: ${radius};
    padding: 0.25em 0.5em;
  }
`;

const Decimal = ({ answer, value, updateAnswerOfType, id, page }) => {
  const [decimal, setDecimal] = useState(value);
  useEffect(() => {
    setDecimal(value);
  }, [value]);
  const errors = filter(answer.validationErrorInfo.errors, {
    field: "decimals",
  });

  const onUpdateDecimal = (value) => {
    updateAnswerOfType({
      variables: {
        input: {
          type: answer.type,
          questionPageId: page.id,
          properties: { ...answer.properties, decimals: value },
        },
      },
    });
  };
  return (
    <>
      <SmallerNumber
        id={id}
        name={answer.id}
        onChange={({ value: decimals }) => setDecimal(decimals)}
        onBlur={() => onUpdateDecimal(decimal)}
        value={decimal}
        invalid={errors.length !== 0}
        max={999999999}
      />
      {errors.length !== 0 && (
        <ValidationError>
          {decimalErrors[errors[0].errorCode].message}
        </ValidationError>
      )}
    </>
  );
};

Decimal.propTypes = {
  id: PropTypes.string,
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  value: PropTypes.number.isRequired,
  updateAnswerOfType: PropTypes.func.isRequired,
};

export default Decimal;
