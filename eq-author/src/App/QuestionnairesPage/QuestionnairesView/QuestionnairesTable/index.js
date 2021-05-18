import React, { useState } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";

import { useHistory } from "react-router-dom";

import { SORT_ORDER } from "constants/sort-order.js";
import * as Headings from "constants/table-headings";

import { buildQuestionnairePath } from "utils/UrlUtils";

import QuestionnaireTable from "components/QuestionnaireTable";
import Panel from "components/Panel";

import tableHeadings from "components/QuestionnaireTable/TableHeadings";

import { useQuestionnaireLockingModal } from "components/modals/QuestionnaireLockingModal";

const enabledRows = [
  Headings.TITLE,
  Headings.OWNER,
  Headings.CREATED,
  Headings.MODIFIED,
  Headings.PERMISSIONS,
  Headings.LOCKED,
  Headings.STARRED,
  Headings.ACTIONS,
];

const QuestionnairesTable = ({
  questionnaires,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  autoFocusId,
  sortColumn,
  sortOrder,
}) => {
  const [targetQuestionnaire, setTargetQuestionnaire] = useState({});
  const {
    trigger: triggerLockModal,
    component: LockModal,
  } = useQuestionnaireLockingModal(targetQuestionnaire);

  const history = useHistory();

  const handleLock = (questionnaire) => {
    setTargetQuestionnaire(questionnaire);
    triggerLockModal();
  };

  const handleClick = (questionnaireId) =>
    history.push(
      buildQuestionnairePath({
        questionnaireId,
      })
    );

  return (
    <Panel>
      <QuestionnaireTable
        sortOrder={sortOrder}
        currentSortColumn={sortColumn}
        tableHeadings={tableHeadings}
        questionnaires={questionnaires}
        autoFocusId={autoFocusId}
        onDeleteQuestionnaire={onDeleteQuestionnaire}
        onDuplicateQuestionnaire={onDuplicateQuestionnaire}
        handleLock={handleLock}
        enabledHeadings={enabledRows}
        onRowClick={handleClick}
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
  autoFocusId: PropTypes.string,
  sortColumn: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf([SORT_ORDER.ASCENDING, SORT_ORDER.DESCENDING]),
};

export default QuestionnairesTable;
