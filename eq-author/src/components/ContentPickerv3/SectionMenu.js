import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { find } from "lodash";

import { getPages } from "utils/questionnaireUtils";

import { Menu, SubMenu } from "./Menu";
import ScrollPane from "components/ScrollPane";

const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
`;

const Column = styled.div`
  width: 50%;
`;

const findDefaultSection = (firstSelectedItemId, data) => {
  if (firstSelectedItemId) {
    return find(data, {
      folders: [
        {
          pages: [{ answers: [{ id: firstSelectedItemId }] }],
        },
      ],
    });
  }

  return find(data, (section) => getPages({ sections: [section] }).length);
};

const SectionMenu = ({
  data,
  onSelected,
  isSelected,
  firstSelectedItemId,
  multiselect,
  ...otherProps
}) => {
  const [selectedSection, setSelectedSection] = useState(
    findDefaultSection(firstSelectedItemId, data)
  );

  const showNewSection = (section) => {
    if (!multiselect) {
      onSelected();
    }

    setSelectedSection(section);
  };

  useEffect(() => {
    const section = findDefaultSection(firstSelectedItemId, data);

    if (section) {
      setSelectedSection(section);
    }
  }, [data, firstSelectedItemId]);

  if (!selectedSection) {
    return <React.Fragment />;
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
