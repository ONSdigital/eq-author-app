import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import { isEmpty } from "lodash";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import Button from "components/buttons/Button";

import NoResults from "./NoResults";
import QuestionnairesTable from "./QuestionnairesTable";
import Footer from "./Footer";

import reducer, { buildInitialState, ACTIONS } from "./reducer";
import usePersistedReducer from "./usePersistedReducer";

export const STORAGE_KEY = "questionnaire-list-settings";
const STORED_KEYS = ["currentPageIndex"];

const Header = styled.div`
  margin: 1em 0;
  display: flex;
  z-index: 1;
  align-items: center;
  justify-content: flex-end;
`;

const QuestionnairesView = ({
  questionnaires,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  onCreateQuestionnaire,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const questionnairesRef = useRef(questionnaires);

  const [state, dispatch] = usePersistedReducer(
    STORAGE_KEY,
    STORED_KEYS,
    reducer,
    { currentPageIndex: 0 },
    buildInitialState(questionnairesRef.current)
  );

  if (questionnaires !== questionnairesRef.current) {
    dispatch({
      type: ACTIONS.SET_QUESTIONNAIRES,
      payload: questionnaires,
    });
    questionnairesRef.current = questionnaires;
  }

  const handleDeleteQuestionnaire = questionnaire => {
    dispatch({
      type: ACTIONS.DELETE_QUESTIONNAIRE,
      payload: questionnaire,
    });
    onDeleteQuestionnaire(questionnaire.id);
  };

  if (isEmpty(state.questionnaires)) {
    return (
      <>
        <NoResults onCreateQuestionnaire={handleModalOpen} />
        <QuestionnaireSettingsModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={onCreateQuestionnaire}
          confirmText="Create"
        />
      </>
    );
  }

  return (
    <>
      <Header>
        <Button
          onClick={handleModalOpen}
          primary
          data-test="create-questionnaire"
        >
          Create questionnaire
        </Button>
      </Header>
      <QuestionnairesTable
        questionnaires={state.currentPage}
        onDeleteQuestionnaire={handleDeleteQuestionnaire}
        onDuplicateQuestionnaire={onDuplicateQuestionnaire}
        autoFocusId={state.autoFocusId}
      />
      <Footer
        countOnPage={state.currentPage.length}
        totalCount={state.questionnaires.length}
        pageCount={state.pages.length}
        currentPageIndex={state.currentPageIndex}
        onPageChange={newPage =>
          dispatch({ type: ACTIONS.CHANGE_PAGE, payload: newPage })
        }
      />
      <QuestionnaireSettingsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={onCreateQuestionnaire}
        confirmText="Create"
      />
    </>
  );
};

QuestionnairesView.propTypes = {
  questionnaires: PropTypes.arrayOf(
    propType(QuestionnairesTable.fragments.QuestionnaireDetails)
  ),
  onCreateQuestionnaire: PropTypes.func.isRequired,
  onDeleteQuestionnaire: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func.isRequired,
};

export default QuestionnairesView;
