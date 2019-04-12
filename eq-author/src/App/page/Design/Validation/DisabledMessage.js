import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Message = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  font-weight: bold;
  margin-bottom: 3em;
`;

const DisabledMessage = ({ name }) => <Message>{name} is disabled</Message>;

DisabledMessage.propTypes = {
  name: PropTypes.string.isRequired,
};

export default DisabledMessage;
