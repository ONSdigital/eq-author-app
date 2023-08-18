import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Decimal from "components/AnswerContent/Decimal";
import Required from "components/AnswerContent/Required";
import MultiLineField from "components/AnswerContent/Format/MultiLineField";

const Paragraph = styled.p`
  margin-top: 0em;
  margin-bottom: 0.35em;
`;

const NumberProperties = ({
  answer,
  page,
  updateAnswer,
  updateAnswerOfType,
  hasMutuallyExclusiveAnswer,
}) => {
  return (
    <>
      <MultiLineField
        id={`${answer.id}-decimals`}
        label="Maximum number of decimal places"
      >
        <Paragraph>
          Must be between 0 and 6. For example, 2 to allow numbers such as 1.11
        </Paragraph>
        <Decimal
          id={`${answer.id}-decimals`}
          answer={answer}
          page={page}
          data-test="decimals"
          updateAnswerOfType={updateAnswerOfType}
          value={answer.properties.decimals}
        />
      </MultiLineField>
      <Required
        answer={answer}
        updateAnswer={updateAnswer}
        hasMutuallyExclusiveAnswer={hasMutuallyExclusiveAnswer}
      />
    </>
  );
};

NumberProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  page: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
  updateAnswerOfType: PropTypes.func,
  hasMutuallyExclusiveAnswer: PropTypes.bool,
};

export default NumberProperties;
