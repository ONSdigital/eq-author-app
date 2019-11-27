import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";

const Button = styled.button`
  color: ${colors.white};
  border: none;
  background: transparent;
  cursor: pointer;
  transition: color 200ms ease-in, opacity 300ms ease-in;
  width: 3em;
  height: 3em;
  padding: 0;
  display: block;

  :hover {
    color: ${colors.lightGrey};
  }

  :focus {
    outline: 3px solid ${colors.orange};
  }

  svg {
    pointer-events: none;
    flex: 0 0 2em;
    path {
      fill: currentColor;
    }
    :hover {
      color: ${colors.black};
    }
  }
`;

const IconButton = ({ icon: Icon, onClick, ...otherProps }) => (
  <Button onClick={onClick} {...otherProps}>
    <Icon />
  </Button>
);

IconButton.propTypes = {
  icon: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default IconButton;
