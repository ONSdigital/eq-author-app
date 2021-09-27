import React from "react";
import PropTypes from "prop-types";
import Decimal from "components/AnswerContent/Decimal";
import Required from "components/AnswerContent/Required";
import MultiLineField from "components/AnswerContent/Format/MultiLineField";

const NumberProperties = ({
  answer,
  page,
  updateAnswer,
  updateAnswerOfType,
}) => {
  return (
    <>
      <MultiLineField id="decimals" label="Decimal places">
        <Decimal
          id="decimals"
          answer={answer}
          page={page}
          data-test="decimals"
          updateAnswerOfType={updateAnswerOfType}
          value={answer.properties.decimals}
        />
      </MultiLineField>
      <Required answer={answer} updateAnswer={updateAnswer} />
    </>
  );
};

NumberProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
  updateAnswerOfType: PropTypes.func,
};

export default NumberProperties;
