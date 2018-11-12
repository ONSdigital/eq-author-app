import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, radius } from "constants/theme";
import BasicAnswer from "components/Answers/BasicAnswer";

const StyledSpan = styled.span`
  display: inline-block;
  background-color: ${colors.lighterGrey};
  border-right: 1px solid ${colors.borders};
  border-radius: ${radius} 0 0 ${radius};
  padding: 0.6em 0;
  width: 2.5em;
  font-weight: 700;
  font-size: 1em;
  line-height: 1.1;
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
  color: ${colors.lightGrey};
`;

const FieldWrapper = styled.div`
  display: block;
  width: 50%;
  margin-bottom: 1em;
  position: relative;
  overflow: hidden;
`;

const CurrencyComponent = props => (
  <StyledSpan>{props.currencyUnit}</StyledSpan>
);

CurrencyComponent.propTypes = {
  currencyUnit: PropTypes.string
};

CurrencyComponent.defaultProps = {
  currencyUnit: "£"
};

const CurrencyAnswer = props => (
  <BasicAnswer showDescription {...props}>
    <FieldWrapper>
      <CurrencyComponent />
    </FieldWrapper>
  </BasicAnswer>
);

CurrencyAnswer.fragments = {
  Currency: BasicAnswer.fragments.Answer
};

export default CurrencyAnswer;
