import React from "react";
import styled from "styled-components";

import PropTypes from "prop-types";

import { colors } from "constants/theme";

const StyledGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2em 0 0;
  border: 1px solid ${colors.lightGrey};
  background-color: ${colors.lighterGrey};
  width: 100%;
  margin: 0;
  justify-content: space-between;
`;

const CollectionListItem = ({ id, displayName }) => {
  return (
    <StyledGrid>
      <StyledItem>
        {id} - {displayName}
      </StyledItem>
    </StyledGrid>
  );
};

CollectionListItem.propTypes = {
  id: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
};

export default CollectionListItem;
