import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import styled from "styled-components";
import { colors } from "constants/theme";
import { rgba } from "polished";

import { buildSectionPath } from "utils/UrlUtils";

import { Grid, Column } from "components/Grid";
import EditorLayout from "components/EditorLayout";
import CustomPropTypes from "custom-prop-types";

import Badge from "components/Badge";
import VerticalTabs from "components/VerticalTabs";

const activeClassName = "active";

const LogicMainCanvas = styled.div`
  display: flex;
  border: 1px solid ${colors.lightGrey};
  border-radius: 4px;
  background: ${colors.white};
`;

const LogicContainer = styled.div`
  padding: 0.8em;
  border-left: 1px solid ${colors.lightGrey};
`;

const StyledUl = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const MenuTitle = styled.div`
  width: 100%;
  padding: 1em 1.2em;
  font-weight: bold;
  border-bottom: 1px solid ${colors.lightGrey};
`;

const LogicLink = styled(NavLink)`
  --color-text: ${colors.black};
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1em;
  color: var(--color-text);
  font-size: 1em;
  border-left: 5px solid ${colors.lightGrey};
  border-bottom: 1px solid ${colors.lightGrey};

  &:hover {
    background: ${rgba(0, 0, 0, 0.2)};
  }

  &:active {
    outline: none;
  }

  &.${activeClassName} {
    --color-text: ${colors.white};

    background: ${colors.blue};
    border-left: 5px solid ${colors.orange};
    pointer-events: none;
  }
`;

const TABS = (sectionId, questionnaireId) => [
  {
    title: "Display logic",
    url: `${buildSectionPath({
      sectionId,
      tab: "display",
      questionnaireId,
    })}`,
  },
];

const hasIntroductionContent = (section) =>
  section.introductionTitle || section.introductionContent;

const LogicPage = ({ children, section }) => (
  console.log(section),
  (
    <EditorLayout
      design
      preview={hasIntroductionContent(section)}
      logic
      validationErrorInfo={section?.validationErrorInfo}
      title={section?.displayName || ""}
      singleColumnLayout
      mainCanvasMaxWidth="80em"
    >
      <LogicMainCanvas>
        <Grid>
          <VerticalTabs
            title="Select your logic"
            cols={2.5}
            tabItems={TABS(section.id, section.questionnaire.id)}
          />
          <Column gutters={false} cols={9.5}>
            <LogicContainer>{children}</LogicContainer>
          </Column>
        </Grid>
      </LogicMainCanvas>
    </EditorLayout>
  )
);

LogicPage.propTypes = {
  children: PropTypes.node.isRequired,
  page: CustomPropTypes.page,
};

export default LogicPage;
