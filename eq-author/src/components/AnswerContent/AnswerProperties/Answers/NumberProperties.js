import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Decimal from "components/AnswerContent/AnswerProperties/Decimal";
import Required from "components/AnswerContent/Required";
import MultiLineField from "components/AnswerContent/AnswerProperties/Format/MultiLineField";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const NumberProperties = ({
  answer,
  page,
  updateAnswer,
  updateAnswerOfType,
}) => {
  return (
    <>
      <Container>
        <MultiLineField id="decimal" htmlFor="decimal" label="Decimal places">
          <Decimal
            id={answer.id}
            answer={answer}
            page={page}
            data-test="decimals"
            updateAnswerOfType={updateAnswerOfType}
            value={answer.properties.decimals}
          />
        </MultiLineField>
      </Container>
      <Container>
        <Required answer={answer} updateAnswer={updateAnswer} />
      </Container>
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
