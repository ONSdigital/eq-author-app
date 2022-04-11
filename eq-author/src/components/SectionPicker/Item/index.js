import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";

const Item = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 1.5em;
  border-bottom: 1px solid ${colors.lightGrey};
  cursor: pointer;
  height: 3em;
  &:hover {
    background-color: ${colors.lighterGrey};
  }

  &:focus {
    ${focusStyle}
  }

  ${({ position }) =>
    position === 0 &&
    `
      border-top: 1px solid ${colors.lightGrey};
    `}

  ${(props) =>
    props["aria-selected"] &&
    !props.heading &&
    `
        background-color: ${colors.primary};

        &:hover {
            background: ${colors.mediumBlue};
        }

        ${Title} {
            color: ${colors.white};
        }

        ${Subtitle} {
            color: ${colors.white};
        }
    `}
`;

const List = styled.div``;

const Heading = styled.h3`
  font-size: 1em;
  font-weight: bold;
  color: ${colors.darkGrey};
  margin: 0;
`;

const Title = styled.span`
  font-size: 1em;
  margin: 0;
  padding: 0;
  color: ${colors.black};
  display: flex;
  align-items: center;

  svg {
    width: 1.75em;
    height: 1.75em;
    fill: ${colors.darkGrey};
    margin-right: 1em;
    margin-left: -0.2em;
  }
`;

const Subtitle = styled.span`
  font-size: 0.9em;
  margin: 0;
  color: ${colors.darkGrey};
`;

const WrappedItem = ({
  icon,
  title,
  subtitle,
  variant,
  selected,
  onClick,
  position,
  children,
  dataTest,
}) => {
  const onEnterUp = (keyCode, callback) => {
    if (keyCode === 13) {
      callback();
    }
  };

  return (
    <List data-test={dataTest}>
      <Item
        className={`${variant}`}
        aria-selected={selected}
        tabIndex={0}
        onClick={onClick}
        onKeyUp={({ keyCode }) => onEnterUp(keyCode, onClick)}
        position={position}
        data-test="section-picker-item"
      >
        {variant !== "heading" && subtitle && <Subtitle>{subtitle}</Subtitle>}
        {variant !== "heading" && (
          <Title>
            {icon} {title}
          </Title>
        )}
        {variant === "heading" && <Heading>{title}</Heading>}
      </Item>
      {children}
    </List>
  );
};
WrappedItem.propTypes = {
  icon: PropTypes.node,
  unselectable: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  position: PropTypes.number,
  children: PropTypes.node,
  dataTest: PropTypes.string,
};

export default WrappedItem;
