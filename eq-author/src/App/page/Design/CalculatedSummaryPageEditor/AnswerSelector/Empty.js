import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";
import { calculatedSummaryErrors } from "constants/validationMessages";

import { ReactComponent as IconInfo } from "assets/icon-info.svg";

import Button from "components/buttons/Button";
import ValidationError from "components/ValidationError";

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1em;
  margin: 0 0 0.5em;
  color: ${colors.darkGrey};
`;

const Text = styled.p`
  font-size: 0.9em;
  margin: 0 0 1em;
  color: ${colors.darkGrey};
`;

const ErrorBox = styled.div`
  border: 2px solid ${colors.errorPrimary};
  padding: 10px;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledButton = styled(Button)`
  padding: 0.5em 1em;
`;

const Empty = ({ page, availableSummaryAnswers, onSelect }) => {
  const word = availableSummaryAnswers.length
    ? "or calculated summary totals selected"
    : "available";
  const phrase = availableSummaryAnswers.length
    ? "Select an answer or calculated summary total using the button below."
    : "There are no answers to provide a calculated summary.";

  const {
    validationErrorInfo: { errors },
  } = page;

  return (
    <>
      <Centered>
        <IconInfo />
        <Title>{`No answers ${word}`}</Title>
        <Text>{phrase}</Text>
        <ErrorBox>
          <StyledButton
            small
            data-test="answer-selector-empty"
            disabled={!availableSummaryAnswers.length}
            onClick={onSelect}
          >
            Select an answer or calculated summary total
          </StyledButton>
        </ErrorBox>
      </Centered>{" "}
      <ValidationError>
        {calculatedSummaryErrors[errors[0]?.errorCode]}
      </ValidationError>
    </>
  );
};

Empty.propTypes = {
  page: PropTypes.object.isRequired, // eslint-disable-line
  availableSummaryAnswers: PropTypes.array.isRequired, // eslint-disable-line
  onSelect: PropTypes.func.isRequired, // eslint-disable-line
};

export default Empty;
