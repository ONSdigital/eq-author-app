import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";

const ContentSpacer = styled.div`
  padding: 0.2em 0.8em;
  padding-right: 0;
`;
const ContentCategory = styled.span`
  display: block;
  padding: 0.2em 0.8em;
  color: ${colors.orange};
  font-weight: 600;
  background-color: ${colors.black};
`;

export const FolderAddSubMenu = ({ folderTitle, children }) => (
  <>
    <ContentSpacer>
      <ContentCategory>
        Inside {folderTitle || "Untitled folder"}
      </ContentCategory>
    </ContentSpacer>
    {children}
    <ContentSpacer>
      <ContentCategory>
        Outside {folderTitle || "Untitled folder"}
      </ContentCategory>
    </ContentSpacer>
  </>
);

FolderAddSubMenu.propTypes = {
  children: PropTypes.node.isRequired,
  folderTitle: PropTypes.string,
};
