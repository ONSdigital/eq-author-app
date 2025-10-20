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
      border-color: ${colors.lightGrey};
    }
  `}

  ${({ variant }) =>
    variant === "heading" &&
    `
        height: 2em; 
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
    padding-left: 2.1rem;
  }

  &${Item}:first-of-type .heading {
    border-top: 1px solid ${colors.lightGrey};
  }
`;
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

const ContentBadge = styled.span`
  font-size: 0.8em;
  position: absolute;
  padding: 0.3em 0.7em;
  right: 1.5em;
  background: ${colors.lightMediumGrey};
  border-radius: 1em;
`;

const WrappedItem = ({
  id,
  title,
  subtitle,
  isListCollector,
  variant,
  selected,
  unselectable = false,
  onClick,
  children,
}) => {
  const handleEnterUp = (key, onEnter) => {
    if (key === "Enter") {
      onEnter();
    }
  };

  return (
    <ListItem>
      <Item
        variant={variant}
        className={`${variant}`}
        aria-selected={selected}
        $unselectable={unselectable}
        tabIndex={unselectable ? -1 : 0}
        onClick={onClick}
        onKeyUp={({ key }) => handleEnterUp(key, onClick)}
        data-test={`folder-picker-item-${id}`}
      >
        {variant !== "heading" && subtitle && (
          <Subtitle data-test={`folder-picker-subtitle-${id}`}>
            {subtitle}
          </Subtitle>
        )}
        {variant !== "heading" && (
          <Title data-test={`folder-picker-title-${id}`}>{title}</Title>
        )}
        {isListCollector && (
          <ContentBadge data-test={`folder-picker-content-badge-${id}`}>
            List collector
          </ContentBadge>
        )}
        {variant === "heading" && (
          <Heading data-test={`folder-picker-heading-${id}`}>{title}</Heading>
        )}
      </Item>
      {children}
    </ListItem>
  );
};
WrappedItem.propTypes = {
  id: PropTypes.string,
  icon: PropTypes.node,
  unselectable: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  isListCollector: PropTypes.bool,
  variant: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default WrappedItem;
