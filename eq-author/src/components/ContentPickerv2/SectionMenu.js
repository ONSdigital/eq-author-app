import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { find } from "lodash";
import { Menu, SubMenu } from "./Menu";
import styled from "styled-components";
import ScrollPane from "components/ScrollPane";

const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
`;

const Column = styled.div`
  width: 50%;
`;

const SectionMenu = ({
  data,
  onSelected,
  isSelected,
  firstSelectedItemId,
  multiselect,
  ...otherProps
}) => {
  const defaultSelectedSection = firstSelectedItemId
    ? find(data, {
        folders: {
          pages: [{ answers: [{ id: firstSelectedItemId }] }],
        },
      })
    : data[0];

  const [selectedSection, setSelectedSection] = useState(
    defaultSelectedSection
  );

  const showNewSection = (section) => {
    if (!multiselect) {
      onSelected();
    }

    setSelectedSection(section);
  };

  if (!selectedSection) {
    return;
  }

  return (
    <ColumnContainer>
      <Column>
        <ScrollPane background>
          <Menu
            data={data}
            {...otherProps}
            onSelected={showNewSection}
            isSelected={(item) => selectedSection.id === item.id}
          />
        </ScrollPane>
      </Column>
      <Column>
        <ScrollPane background>
          <SubMenu
            data={selectedSection.folders.flatMap(({ pages }) => pages)}
            onSelected={onSelected}
            isSelected={isSelected}
            {...otherProps}
          />
        </ScrollPane>
      </Column>
    </ColumnContainer>
  );
};

SectionMenu.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  firstSelectedItemId: PropTypes.string,
  multiselect: PropTypes.bool,
};

export default SectionMenu;
