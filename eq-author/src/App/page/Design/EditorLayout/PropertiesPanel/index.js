import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isEmpty } from "lodash/fp";

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
  border-left: 2px solid #eee;
  font-size: 1em;
`;

const PropertiesPaneBody = styled.div`
  background: ${colors.white};
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;

const PropertiesPanelWrapper = ({ children }) => (
  <PropertiesPane>
    <PropertiesPaneBody>
      <ScrollPane>{children}</ScrollPane>
    </PropertiesPaneBody>
  </PropertiesPane>
);
PropertiesPanelWrapper.propTypes = {
  children: PropTypes.node,
};

const PropertiesPanel = ({ page }) => {
  if (isEmpty(page) || page.pageType !== "QuestionPage") {
    return <PropertiesPanelWrapper />;
  }

  return (
    <PropertiesPanelWrapper>
      <Accordion title="Optional fields">
        <Padding>
          <QuestionProperties page={page} />
        </Padding>
      </Accordion>
      <GroupedAnswerProperties page={page} />
    </PropertiesPanelWrapper>
  );
};

PropertiesPanel.propTypes = {
  page: CustomPropTypes.page,
};

export default PropertiesPanel;
