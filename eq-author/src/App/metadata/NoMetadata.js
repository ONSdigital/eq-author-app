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
  max-width: 31em;
  margin: 1em auto;
  color: ${colors.textLight};
`;

const NoMetadata = ({ onAddMetadata }) => {
  return (
    <Wrapper>
      <Title>No metadata found</Title>
      <Text>
        {
          "Metadata can be piped into questions within your questionnaire. When a survey is published, we connect the metadata to a sample file so respondents see actual values."
        }
      </Text>
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
