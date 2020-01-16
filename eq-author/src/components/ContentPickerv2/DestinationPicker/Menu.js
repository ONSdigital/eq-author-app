import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { MenuItemList, ParentMenuItem } from "../Menu";

const Menu = ({ data, onSelected, isSelected }) => {
  const onEnterUp = (event, section) => {
    if (event.keyCode === 13) {
      //13 is the enter keycode
      onSelected(section);
    }
  };
  const sections = data || [];
  return (
    <MenuItemList>
      {sections.map(section => {
        const sectionSelected = isSelected(section);

        return (
          <ParentMenuItem
            key={section.id}
            onClick={() => {
              onSelected(section);
            }}
            aria-selected={sectionSelected}
            tabIndex={sectionSelected ? "" : "0"}
            onKeyUp={event => onEnterUp(event, section)}
          >
            {section.displayName}
          </ParentMenuItem>
        );
      })}
    </MenuItemList>
  );
};

Menu.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
};

export default Menu;
