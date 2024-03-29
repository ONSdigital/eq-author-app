import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import { colors } from "constants/theme";

import { buildSectionPath } from "utils/UrlUtils";

import { Grid, Column } from "components/Grid";
import EditorLayout from "components/EditorLayout";
import CustomPropTypes from "custom-prop-types";

import VerticalTabs from "components/VerticalTabs";
import { useSetNavigationCallbacks } from "components/NavigationCallbacks";
import {
  useCreatePageWithFolder,
  useCreateFolder,
  useCreateListCollectorFolder,
} from "hooks/useCreateFolder";

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

const TABS = (sectionId, questionnaireId, validationErrorInfo) => [
  {
    title: "Display logic",
    url: `${buildSectionPath({
      sectionId,
      tab: "display",
      questionnaireId,
    })}`,
    errorCount: validationErrorInfo?.errors?.filter(
      ({ type }) => type && type.includes("display")
    ).length,
    enabled: true,
  },
];

const hasIntroductionContent = (section) =>
  section.introductionTitle || section.introductionContent;

const LogicPage = ({ children, section }) => {
  const addFolderWithPage = useCreatePageWithFolder();
  const addFolder = useCreateFolder();
  const addListCollectorFolder = useCreateListCollectorFolder();

  useSetNavigationCallbacks(
    {
      onAddQuestionPage: () =>
        addFolderWithPage({ sectionId: section.id, position: 0 }),
      onAddCalculatedSummaryPage: () =>
        addFolderWithPage({
          sectionId: section.id,
          position: section.folders.length + 1,
          isCalcSum: true,
        }),
      onAddFolder: () => addFolder({ sectionId: section.id, position: 0 }),
      onAddListCollectorFolder: () =>
        addListCollectorFolder({
          sectionId: section.id,
          position: 0,
        }),
    },
    [section]
  );

  return (
    <EditorLayout
      design
      preview={Boolean(hasIntroductionContent(section))}
      logic
      validationErrorInfo={section.validationErrorInfo}
      title={section.displayName || ""}
      singleColumnLayout
      mainCanvasMaxWidth="80em"
      comments={section.comments}
    >
      <LogicMainCanvas>
        <Grid>
          <VerticalTabs
            title="Select your logic"
            cols={2.5}
            tabItems={TABS(
              section.id,
              section.questionnaire.id,
              section.validationErrorInfo
            )}
          />
          <Column gutters={false} cols={9.5}>
            <LogicContainer>{children}</LogicContainer>
          </Column>
        </Grid>
      </LogicMainCanvas>
    </EditorLayout>
  );
};

LogicPage.propTypes = {
  children: PropTypes.node.isRequired,
  section: CustomPropTypes.section,
};

export default LogicPage;
