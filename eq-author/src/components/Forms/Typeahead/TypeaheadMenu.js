import React from "react";
import PropTypes from "prop-types";

import styled, { css } from "styled-components";
import { colors, radius } from "constants/theme";

const Menu = styled.div`
  display: block;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  max-height: 13em;
  overflow: scroll;
`;

const MenuList = styled.ul`
  list-style: none;
  background: white;
  padding: 0.05em 0.25em;
  margin: 0;
  &:empty {
    padding: 0;
  }
`;

const active = css`
  background-color: #e4e8eb;
`;

const selected = css`
  background-color: ${colors.primary};
  color: white;
`;

const MenuItem = styled.li`
  cursor: pointer;
  display: block;
  appearance: none;
  border: none;
  font-size: 1em;
  width: 100%;
  text-align: left;
  line-height: 1;
  position: relative;
`;

const MenuItemText = styled.div`
  border-radius: ${radius};
  margin: 0.25em 0.1em;
  padding: 0.6em 1em;
  line-height: 1;
  ${props => props.isActive && active};
  ${props => props.isSelected && selected};
`;

export const filterItemsByInputValue = (items, inputValue) =>
  items.filter(item => !inputValue || item.value.includes(inputValue));

const TypeaheadMenu = ({
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
  inputValue,
  items,
  ...otherProps
}) => {
  return (
    <Menu {...otherProps}>
      <MenuList {...getMenuProps()}>
        {filterItemsByInputValue(items, inputValue).map((item, index) => (
          <MenuItem
            key={item.value}
            {...getItemProps({
              index,
              item
            })}
          >
            <MenuItemText
              isActive={highlightedIndex === index}
              isSelected={selectedItem === item}
            >
              {item.value}
            </MenuItemText>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

TypeaheadMenu.propTypes = {
  getMenuProps: PropTypes.func.isRequired,
  getItemProps: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number,
  selectedItem: PropTypes.shape({ value: PropTypes.string.isRequired }),
  inputValue: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string.isRequired })
  )
};

export default TypeaheadMenu;
