import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { colors } from "constants/theme";

import Menu from "./SectionMenu";

const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.textLight};
`;

const ModalHeader = styled.div`
  padding: 1.5em 1em 1.5em;
  border-bottom: 1px solid ${colors.bordersLight};
  display: flex;
  align-items: center;
`;

const MenuContainer = styled.div`
  overflow: hidden;
  height: 25em;
`;

const DestinationPicker = ({ data, onSelected, isSelected, ...otherProps }) => (
  <>
    <ModalHeader>
      <ModalTitle>Select a destination</ModalTitle>
    </ModalHeader>
    <MenuContainer>
      <Menu
        data={data}
        onSelected={onSelected}
        isSelected={isSelected}
        {...otherProps}
      />
    </MenuContainer>
  </>
);

DestinationPicker.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
};

export default DestinationPicker;
