import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { last } from "lodash";

import ScrollPane from "components/ScrollPane";
import Truncated from "components/Truncated";
import {
  MenuItemList,
  ParentMenuItem,
  SubMenuItem,
  MenuItemTitles,
  MenuItemTitle,
} from "../Menu";

import { keyCodes } from "constants/keyCodes";

const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
`;

const Column = styled.div`
  width: ${props => props.width}%;
`;

// move to constants?
const destinationKey = {
  NextPage: "Next page",
  EndOfQuestionnaire: "End of questionnaire",
};

// rename this function
const logicalDestinations = ({ pages, logicalDestinations }) => {
  const dest = logicalDestinations.map(item => {
    item.displayName = destinationKey[item.id];
    return item;
  });
  dest.splice(1, 0, {
    ...last(pages),
    displayName: "End of current section",
  });
  return dest;
};

// rename in future
const getData = data => [
  {
    title: "Current section",
    destinations: data.pages,
  },
  {
    title: "Later sections",
    destinations: data.sections,
  },
  {
    title: "Other destinations",
    destinations: logicalDestinations(data),
  },
];

const SectionMenu = ({ data, onSelected, isSelected }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const sectionData = getData(data);

  const { Enter, Space } = keyCodes;
  const onEnterUp = (event, section) => {
    if (event.key === Enter || event.key === Space) {
      onSelected(section);
    }
  };

  return (
    <ColumnContainer>
      <Column width={44}>
        <ScrollPane>
          {sectionData.map((item, index) => (
            <ParentMenuItem
              key={index}
              onClick={() => setSelectedTab(index)}
              tabIndex={"0"}
              onKeyUp={event => {
                (event.key === Enter || event.key === Space) &&
                  setSelectedTab(index);
              }}
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
            {sectionData[selectedTab].destinations.map(dest => {
              return (
                <SubMenuItem
                  key={dest.id}
                  aria-selected={isSelected(dest)}
                  onClick={() => onSelected(dest)}
                  tabIndex={0}
                  onKeyUp={event => onEnterUp(event, dest)}
                >
                  <MenuItemTitles>
                    <MenuItemTitle>
                      <Truncated>{dest.displayName}</Truncated>
                    </MenuItemTitle>
                  </MenuItemTitles>
                </SubMenuItem>
              );
            })}
          </MenuItemList>
        </ScrollPane>
      </Column>
    </ColumnContainer>
  );
};

SectionMenu.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
};

export default SectionMenu;
