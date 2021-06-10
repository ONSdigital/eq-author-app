import React from "react";
import styled from "styled-components";

import { colors } from "constants/theme";
import CustomPropTypes from "custom-prop-types";

import GroupedAnswerProperties from "./GroupedAnswerProperties";

const PropertiesPane = styled.div`
  background: ${colors.white};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  font-size: 1em;

  h2 {
    font-family: Lato, sans-serif;
    font-size: 0.85em;
    letter-spacing: 0;
    font-weight: bold;
  }
`;

const PropertiesPanel = ({ page }) => (
  <PropertiesPane>
    <GroupedAnswerProperties page={page} />
  </PropertiesPane>
);

PropertiesPanel.propTypes = {
  page: CustomPropTypes.page,
};

export default PropertiesPanel;
