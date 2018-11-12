import React from "react";
import Icon from "./icon-loading.svg?inline";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";
import Delay from "components/Delay";

const colorChange = keyframes`
  from {
     fill: #ccc;
  }
  to {
    fill: ${colors.primary};
  }
`;

const Container = styled.div`
  height: ${props => props.height};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Message = styled.p`
  font-weight: bold;
  font-size: 1.125em;
  margin: 0;
`;

const StyledIcon = styled(Icon)`
  margin-bottom: 1em;

  .block {
    fill: #ccc;
    animation: ${colorChange} 1s ease-in infinite alternate;
  }
`;

const Loading = ({ children, height }) => (
  <Container data-test="loading" height={height}>
    <Delay>
      <StyledIcon />
      <Message>{children}</Message>
    </Delay>
  </Container>
);

Loading.propTypes = {
  children: PropTypes.string.isRequired,
  height: PropTypes.string
};

Loading.defaultProps = {
  height: "auto",
  children: "Loading…"
};

export default Loading;
