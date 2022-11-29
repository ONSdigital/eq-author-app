import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";
import { useParams } from "react-router-dom";

import { Toolbar, ToolbarButtonContainer } from "components/Toolbar";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import Modal from "components-themed/Modal";

import { buildQuestionnairePath } from "utils/UrlUtils";

import DELETE_INTRODUCTION from "graphql/deleteIntroductionPage.graphql";
import {
  DELETE_INTRODUCTION_PAGE_TITLE,
  DELETE_BUTTON_TEXT,
} from "constants/modal-content";

const IntroductionToolbar = styled(Toolbar)`
  padding: 1.5em 2em 0;
`;

const IntroductionHeader = ({ history }) => {
  const { questionnaireId } = useParams();

  const [deleteIntroduction] = useMutation(DELETE_INTRODUCTION, {
    onCompleted: () => {
      history.push(
        buildQuestionnairePath({
          questionnaireId,
        })
      );
    },
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Modal
        title={DELETE_INTRODUCTION_PAGE_TITLE}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={() => deleteIntroduction()}
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
