import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";

import { ReactComponent as IconAlert } from "assets/icon-alert.svg";

const Alert = styled.div`
  background: white;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 5em;
  text-align: center;
  color: #666;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1.1em;
  margin: 0 0 0.5em;
  font-weight: bold;
  color: ${colors.text};
`;

const Caption = styled.p`
  font-size: 1em;
  margin: 0;
  font-weight: normal;
`;

const Icon = styled(IconAlert)`
  width: 2em;
  height: 2em;
  margin-bottom: 0.5em;
`;

const NoSearchResults = ({ searchTerm, alertText }) => (
  <Alert>
    <Icon />
    <Title>{`No results found for '${searchTerm}'.`}</Title>
    <Caption>{alertText}</Caption>
  </Alert>
);

NoSearchResults.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
};

export default NoSearchResults;
