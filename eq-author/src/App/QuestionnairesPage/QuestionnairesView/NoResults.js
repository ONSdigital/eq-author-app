import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Button from "components/buttons/Button";
import { colors } from "constants/theme";

import flag from "./flag.svg";

const Wrapper = styled.div`
  padding: 6em 0 10em;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.3em;
  font-weight: 500;
  margin: 0 0 0.5em;

  &::before {
    content: url(${flag});
    display: block;
  }
`;

const Text = styled.p`
  margin: 0 0 1em;
  color: ${colors.textLight};
`;

const NoResults = ({ onCreateQuestionnaire }) => (
  <Wrapper>
    <Title>No questionnaires found</Title>
    <Text>{"You don't have access to any questionnaires yet."}</Text>
    <Button
      onClick={onCreateQuestionnaire}
      variant="primary"
      data-test="create-questionnaire"
    >
      Create a questionnaire
    </Button>
  </Wrapper>
);

NoResults.propTypes = {
  onCreateQuestionnaire: PropTypes.func.isRequired,
};

export default NoResults;
