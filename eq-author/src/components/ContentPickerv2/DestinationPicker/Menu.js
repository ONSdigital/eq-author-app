import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { last } from "lodash";

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
import { destinationKey } from "constants/destinations";

const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
`;

const Column = styled.div`
  width: ${props => props.width}%;
`;

const { Enter, Space } = keyCodes;

export const tabTitles = {
  current: "Current section",
  later: "Later sections",
  other: "Other destinations",
};

const otherDestinations = ({ pages, logicalDestinations }) => {
  const dest = logicalDestinations.map(item => {
    item.displayName = destinationKey[item.id];
    return item;
  });
  dest.splice(1, 0, {
    ...last(pages),
    displayName: destinationKey.EndOfCurrentSection,
  });
  return dest;
};

const buildTabs = data => ({
  current: {
    title: tabTitles.current,
    destinations: data.pages,
  },
  later: {
    title: tabTitles.later,
    destinations: data.sections,
  },
  other: {
    title: tabTitles.other,
    destinations: otherDestinations(data),
  },
});

const Menu = ({ data, onSelected, isSelected }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const { current, later, other } = buildTabs(data);

  // might not need later.destinations
  const tabs = later.destinations ? [current, later, other] : [current, other];

  return (
    <ColumnContainer data-test="destination-picker-menu">
      <Column width={44}>
        <ScrollPane>
          {tabs.map((item, index) => (
            <ParentMenuItem
              key={index}
              onClick={() => setSelectedTab(index)}
              tabIndex={"0"}
              onKeyUp={event =>
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
            {tabs[selectedTab].destinations.map(dest => (
              <SubMenuItem
                key={dest.id}
                aria-selected={isSelected(dest)}
                onClick={() => onSelected(dest)}
                tabIndex={0}
                onKeyUp={event =>
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
            ))}
          </MenuItemList>
        </ScrollPane>
      </Column>
    </ColumnContainer>
  );
};

Menu.propTypes = {
  // data: PropTypes.arrayOf(CustomPropTypes.section),
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
};

export default Menu;
