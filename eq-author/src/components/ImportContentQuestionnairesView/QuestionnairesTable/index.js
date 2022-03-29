import React, { useState } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";
import styled from "styled-components";

import { SORT_ORDER } from "constants/sort-order.js";

import QuestionnaireTable from "components/ImportContentQuestionnaireTable";
import Panel from "components/Panel";

import tableHeadings from "components/ImportContentQuestionnaireTable/TableHeadings";

import { useQuestionnaireLockingModal } from "components/modals/QuestionnaireLockingModal";

const ScrollContainer = styled.div`
  overflow: auto;
  height: 17em;
`;

const QuestionnairesTable = ({
  questionnaires,
  selectedQuestionnaire,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  autoFocusId,
  onSortQuestionnaires,
  onReverseSort,
  sortColumn,
  sortOrder,
  enabledHeadings,
  onQuestionnaireClick,
  questionnaireModal,
  variant,
}) => {
  const [targetQuestionnaire, setTargetQuestionnaire] = useState({});
  const { trigger: triggerLockModal, component: LockModal } =
    useQuestionnaireLockingModal(targetQuestionnaire);

  const handleLock = (questionnaire) => {
    setTargetQuestionnaire(questionnaire);
    triggerLockModal();
  };

  const ConditionalScroll = ({ questionnaireModal, wrapper, children }) =>
    questionnaireModal ? wrapper(children) : children;

  return (
    <ConditionalScroll
      questionnaireModal={questionnaireModal}
      wrapper={(children) => <ScrollContainer>{children}</ScrollContainer>}
    >
      <Panel>
        <QuestionnaireTable
          onSortClick={onSortQuestionnaires}
          onReverseClick={onReverseSort}
          sortOrder={sortOrder}
          currentSortColumn={sortColumn}
          tableHeadings={tableHeadings}
          questionnaires={questionnaires}
          selectedQuestionnaire={selectedQuestionnaire}
          autoFocusId={autoFocusId}
          onDeleteQuestionnaire={onDeleteQuestionnaire}
          onDuplicateQuestionnaire={onDuplicateQuestionnaire}
          handleLock={handleLock}
          enabledHeadings={enabledHeadings}
          onRowClick={onQuestionnaireClick}
          questionnaireModal={questionnaireModal}
          variant={variant}
        />
        <LockModal />
      </Panel>
    </ConditionalScroll>
  );
};

QuestionnairesTable.fragments = {
  QuestionnaireDetails: gql`
    fragment QuestionnaireDetails on Questionnaire {
      id
      title
      shortTitle
      displayName
      starred
      locked
      createdAt
      updatedAt
      createdBy {
        id
        name
        email
        displayName
      }
      permission
      publishStatus
    }
  `,
};

QuestionnairesTable.propTypes = {
  questionnaires: PropTypes.arrayOf(
    propType(QuestionnairesTable.fragments.QuestionnaireDetails)
  ),
  onDeleteQuestionnaire: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func,
  autoFocusId: PropTypes.string,
  onSortQuestionnaires: PropTypes.func,
  onReverseSort: PropTypes.func,
  sortColumn: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf([SORT_ORDER.ASCENDING, SORT_ORDER.DESCENDING]),
  enabledHeadings: PropTypes.array.isRequired, // eslint-disable-line
  onQuestionnaireClick: PropTypes.func,
  questionnaireModal: PropTypes.bool,
  selectedQuestionnaire: PropTypes.object, // eslint-disable-line
  variant: PropTypes.string,
};

export default QuestionnairesTable;
