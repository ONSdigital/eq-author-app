import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import {
  MenuItemList,
  ParentMenuItem,
  SubMenuItem,
  MenuItemTitles,
  MenuItemTitle,
} from "../Menu";
import ScrollPane from "components/ScrollPane";
import Truncated from "components/Truncated";

import { keyCodes } from "constants/keyCodes";

const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
`;

const Column = styled.div`
  width: ${(props) => props.width}%;
`;

export const tabTitles = {
  current: "Current section",
  other: "Other destinations",
};

const { Enter, Space } = keyCodes;

const otherDestinations = ({ logicalDestinations }) => {
  return Object.entries(logicalDestinations).map((item) => {
    return item[1];
  });
};

const buildTabs = (data) => ({
  current: {
    title: tabTitles.current,
    destinations: data.pages,
  },
  other: {
    title: tabTitles.other,
    destinations: otherDestinations(data),
  },
});

const Menu = ({ data, onSelected, isSelected }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const { current, other } = buildTabs(data);

  const getRequiredTabs = () => {
    const requiredTabs = [];

    if (current.destinations.length !== 0) {
      requiredTabs.push(current);
    }
    requiredTabs.push(other);

    return requiredTabs;
  };

  const tabs = getRequiredTabs();

  return (
    <ColumnContainer data-test="destination-picker-menu">
      <Column width={44}>
        <ScrollPane>
          {tabs.map((item, index) => (
            <ParentMenuItem
              key={index}
              onClick={() => setSelectedTab(index)}
              tabIndex={"0"}
              onKeyUp={(event) =>
                (event.key === Enter || event.key === Space) &&
                setSelectedTab(index)
              }
              aria-selected={index === selectedTab}
            >
              {item.title}
            </ParentMenuItem>
          ))}
        </ScrollPane>
      </Column>
      <Column width={56}>
        <ScrollPane>
          <MenuItemList>
            {tabs[selectedTab].destinations.map(
              (dest) =>
                dest.displayEnabled !== false && (
                  <SubMenuItem
                    key={dest.id}
                    aria-selected={isSelected(dest)}
                    onClick={() => onSelected(dest)}
                    tabIndex={0}
                    onKeyUp={(event) =>
                      (event.key === Enter || event.key === Space) &&
                      onSelected(dest)
                    }
                  >
                    <MenuItemTitles>
                      <MenuItemTitle>
                        <Truncated>{dest.displayName}</Truncated>
                      </MenuItemTitle>
                    </MenuItemTitles>
                  </SubMenuItem>
                )
            )}
          </MenuItemList>
        </ScrollPane>
      </Column>
    </ColumnContainer>
  );
};

Menu.propTypes = {
  data: PropTypes.shape({
    pages: PropTypes.array,
    logicalDestinations: PropTypes.object,
  }),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
};

export default Menu;
