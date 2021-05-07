import React, { useState } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";

import { SORT_ORDER } from "constants/sort-order.js";

import Table from "components/Table";
import Panel from "components/Panel";

import tableHeadings from "./TableHeadings";

import { useQuestionnaireLockingModal } from "components/modals/QuestionnaireLockingModal";

const QuestionnairesTable = ({
  questionnaires,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  onSortQuestionnaires,
  onReverseSort,
  autoFocusId,
  sortColumn,
  sortOrder,
}) => {
  const [targetQuestionnaire, setTargetQuestionnaire] = useState({});
  const {
    trigger: triggerLockModal,
    component: LockModal,
  } = useQuestionnaireLockingModal(targetQuestionnaire);

  const handleLock = (questionnaire) => {
    setTargetQuestionnaire(questionnaire);
    triggerLockModal();
  };

  return (
    <Panel>
      <Table
        onSortClick={onSortQuestionnaires}
        onReverseClick={onReverseSort}
        sortOrder={sortOrder}
        currentSortColumn={sortColumn}
        tableHeadings={tableHeadings}
        questionnaires={questionnaires}
        autoFocusId={autoFocusId}
        onDeleteQuestionnaire={onDeleteQuestionnaire}
        onDuplicateQuestionnaire={onDuplicateQuestionnaire}
        handleLock={handleLock}
      />
      <LockModal />
    </Panel>
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
  onDuplicateQuestionnaire: PropTypes.func.isRequired,
  onSortQuestionnaires: PropTypes.func.isRequired,
  onReverseSort: PropTypes.func.isRequired,
  autoFocusId: PropTypes.string,
  sortColumn: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf([SORT_ORDER.ASCENDING, SORT_ORDER.DESCENDING]),
};

export default QuestionnairesTable;
