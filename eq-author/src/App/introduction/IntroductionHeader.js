import React from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";

import { useQuestionnaire } from "components/QuestionnaireContext";
import { Toolbar, ToolbarButtonContainer } from "components/Toolbar";
import IconButtonDelete from "components/buttons/IconButtonDelete";

import { buildSectionPath } from "utils/UrlUtils";

import DELETE_INTRODUCTION from "graphql/deleteIntroductionPage.graphql";

const IntroductionToolbar = styled(Toolbar)`
  padding: 1.5em 2em 0;
`;

const IntroductionHeader = ({ history }) => {
  const { questionnaire } = useQuestionnaire();

  const [deleteIntroduction] = useMutation(DELETE_INTRODUCTION);

  const onDeleteIntroduction = () => {
    deleteIntroduction();

    // Redirect to first section
    const sectionPath = buildSectionPath({
      questionnaireId: questionnaire.id,
      sectionId: questionnaire.sections[0].id,
      tab: "design",
    });

    history.push(sectionPath);
  };

  return (
    <IntroductionToolbar>
      <ToolbarButtonContainer>
        <IconButtonDelete onClick={onDeleteIntroduction}>
          Delete
        </IconButtonDelete>
      </ToolbarButtonContainer>
    </IntroductionToolbar>
  );
};

IntroductionHeader.propTypes = {
  history: CustomPropTypes.history,
};

export default IntroductionHeader;
