import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Button from "components/buttons/Button";

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

const NoSampleFileData = ({ onAddMetadata }) => {
  return (
    <Wrapper>
      <Title>No sample file data found</Title>
      <Button
        onClick={onAddMetadata}
        variant="primary"
        data-test="add-metadata"
      >
        Add sample file data
      </Button>
    </Wrapper>
  );
};

NoSampleFileData.propTypes = {
  onAddMetadata: PropTypes.func.isRequired,
};

export default NoSampleFileData;
