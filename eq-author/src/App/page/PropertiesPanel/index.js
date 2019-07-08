import React from "react";
import styled from "styled-components";

import Accordion from "components/Accordion";
import ScrollPane from "components/ScrollPane";
import { colors } from "constants/theme";
import CustomPropTypes from "custom-prop-types";

import QuestionProperties from "./QuestionProperties";
import GroupedAnswerProperties from "./GroupedAnswerProperties";

const Padding = styled.div`
  padding: 0 0.5em;
`;

const PropertiesPane = styled.div`
  background: ${colors.white};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  font-size: 1em;
`;

const PropertiesPanel = ({ page }) => {
  return (
    <PropertiesPane>
      <ScrollPane>
        <Accordion title="Optional fields">
          <Padding>
            <QuestionProperties page={page} />
          </Padding>
        </Accordion>
        <GroupedAnswerProperties page={page} />
      </ScrollPane>
    </PropertiesPane>
  );
};

PropertiesPanel.propTypes = {
  page: CustomPropTypes.page,
};

export default PropertiesPanel;
