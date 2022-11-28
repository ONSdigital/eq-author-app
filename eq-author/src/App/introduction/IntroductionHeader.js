import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";

import { useQuestionnaire } from "components/QuestionnaireContext";
import { Toolbar, ToolbarButtonContainer } from "components/Toolbar";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import Modal from "components-themed/Modal";

import { buildSectionPath } from "utils/UrlUtils";

import DELETE_INTRODUCTION from "graphql/deleteIntroductionPage.graphql";
import {
  DELETE_INTRODUCTION_PAGE_TITLE,
  DELETE_BUTTON_TEXT,
} from "constants/modal-content";

const IntroductionToolbar = styled(Toolbar)`
  padding: 1.5em 2em 0;
`;

const IntroductionHeader = ({ history }) => {
  const { questionnaire } = useQuestionnaire();
  const [deleteIntroduction] = useMutation(DELETE_INTRODUCTION);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onDeleteIntroduction = () => {
    deleteIntroduction();

    const sectionPath = buildSectionPath({
      questionnaireId: questionnaire.id,
      sectionId: questionnaire.sections[0].id,
    });

    history.push(sectionPath);
  };

  return (
    <>
      <Modal
        title={DELETE_INTRODUCTION_PAGE_TITLE}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={() => onDeleteIntroduction()}
        onClose={() => setShowDeleteModal(false)}
      />
      <IntroductionToolbar>
        <ToolbarButtonContainer>
          <IconButtonDelete onClick={() => setShowDeleteModal(true)}>
            Delete
          </IconButtonDelete>
        </ToolbarButtonContainer>
      </IntroductionToolbar>
    </>
  );
};

IntroductionHeader.propTypes = {
  history: CustomPropTypes.history,
};

export default IntroductionHeader;
