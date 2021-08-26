import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Decimal from "components/AdditionalContent/AnswerProperties/Decimal";
import Required from "components/AdditionalContent/Required";
import MultiLineField from "components/AdditionalContent/AnswerProperties/Format/MultiLineField";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const NumberProperties = ({ answer, onUpdateRequired, onUpdateDecimal }) => {
  return (
    <>
      <Container>
        <MultiLineField id="decimal" htmlFor="decimal" label="Decimal places">
          <Decimal
            id={answer.id}
            answer={answer}
            data-test="decimals"
            onBlur={onUpdateDecimal}
            value={answer.properties.decimals}
            hasDecimalInconsistency={false}
          />
        </MultiLineField>
      </Container>
      <Container>
        <Required answer={answer} onChange={onUpdateRequired} />
      </Container>
    </>
  );
};

NumberProperties.propTypes = {
  onUpdateRequired: PropTypes.func,
  onUpdateDecimal: PropTypes.func,
  answer: PropTypes.object, //eslint-disable-line
};

export default NumberProperties;
