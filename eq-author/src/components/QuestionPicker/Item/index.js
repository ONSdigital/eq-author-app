import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";

const Item = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5em 1.5em;
  border-bottom: 1px solid ${colors.lightGrey};
  cursor: pointer;
  height: 2.2em;
  &:hover {
    background-color: ${colors.lighterGrey};
  }

  &:focus {
    ${focusStyle}
  }

  ${({ unselectable }) =>
    unselectable &&
    `
    cursor: default;
    &:hover {
        background-color: transparent;
    }

    &:focus{
      outline: none;
      box-shadow: none;
    }
  `}

  ${({ variant }) =>
    variant === "heading" &&
    `
        padding: 0;
        background-color: ${colors.lightMediumGrey};

        cursor: default;

        &:hover {
            background-color: ${colors.lightMediumGrey};
        }
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

const ListItem = styled.li`
  list-style: none;
  margin: 0;
  padding: 0;

  ol.sublist li *,
  ul.sublist li * {
    padding-left: 2rem;
  }

  &${Item}:first-of-type .heading {
    border-top: 1px solid ${colors.lightGrey};
  }
`;
const Heading = styled.h3`
  font-size: 1em;
  padding: 0.5em 1.5em;
  font-weight: bold;
  color: ${colors.darkGrey};
  margin: 0;
`;

const Title = styled.p`
  font-size: 1em;
  margin: 0;
  padding: 0;
  color: ${colors.black};
  display: flex;
  align-items: center;

  svg {
    width: 2em;
    height: 2em;
  }
`;

const Subtitle = styled.p`
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
  unselectable,
  onClick,
  children,
  dataTest,
}) => {
  const onEnterUp = (keyCode, callback) => {
    if (keyCode === 13) {
      callback();
    }
  };

  return (
    <ListItem data-test={dataTest}>
      <Item
        variant={variant}
        className={`${variant}`}
        aria-selected={selected}
        unselectable={`${unselectable}`}
        tabIndex={unselectable ? -1 : 0}
        onClick={onClick}
        onKeyUp={({ keyCode }) => onEnterUp(keyCode, onClick)}
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
    </ListItem>
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
  children: PropTypes.node,
  dataTest: PropTypes.string,
};

export default WrappedItem;
