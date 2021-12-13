import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

const Button = styled.button`
  font-size: 0.7em;
  width: 7em;
  height: 7em;
  margin: 0.5em;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 2px solid transparent;
  opacity: 1;
  transition: all 200ms ease-in-out;
  outline: none;
  flex: 1 1 auto;

  order: ${(props) => props.order};

  &:hover {
    border-color: ${colors.borders};
  }

  &:focus:active,
  &:focus-visible {
    border-color: ${colors.blue};
  }

  &[disabled] {
    opacity: 0.5;
    background-color: transparent;
    cursor: default;
    pointer-events: none;
  }
`;

const Title = styled.h3`
  margin: 0;
  padding-top: 0.5em;
  font-weight: 400;
`;

const IconGridButton = ({
  iconSrc,
  title,
  titleAriaHidden = false,
  disabled,
  order,
  onClick,
  doNotShowDR,
  ...otherProps
}) => {
  if (doNotShowDR && title === "Date range") {
    disabled = true;
  }
  return (
    <Button
      role="menuitem"
      title={title}
      onClick={onClick}
      disabled={disabled}
      order={order}
      type="button"
      {...otherProps}
    >
      <img src={iconSrc} alt={title} />
      <Title aria-hidden={titleAriaHidden}>{title}</Title>
    </Button>
  );
};

IconGridButton.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleAriaHidden: PropTypes.bool,
  disabled: PropTypes.bool,
  order: PropTypes.number,
  onClick: PropTypes.func,
  doNotShowDR: PropTypes.bool,
};

export default IconGridButton;
