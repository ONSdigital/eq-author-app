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

const NoMetadata = ({ onAddMetadata }) => {
  return (
    <Wrapper>
      <Title>No metadata found</Title>
      <Text>{"You don't have any metadata yet."}</Text>
      <Button
        onClick={onAddMetadata}
        variant="primary"
        data-test="add-metadata"
      >
        Add metadata
      </Button>
    </Wrapper>
  );
};

NoMetadata.propTypes = {
  onAddMetadata: PropTypes.func.isRequired,
};

export default NoMetadata;
