import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";

import Menu from "./Menu";

const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.textLight};
`;

const ModalHeader = styled.div`
  padding: 1.5em 1em;
  border-bottom: 1px solid ${colors.bordersLight};
  display: flex;
  align-items: center;
`;

const MenuContainer = styled.div`
  overflow: hidden;
  height: 25em;
`;

export const Title = "Select a destination";

const DestinationPicker = ({ data, onSelected, isSelected, ...otherProps }) => (
  <>
    <ModalHeader>
      <ModalTitle>{Title}</ModalTitle>
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
  data: PropTypes.shape({
    pages: PropTypes.array,
    logicalDestinations: PropTypes.func,
    sections: PropTypes.array,
  }),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
};

export default DestinationPicker;
