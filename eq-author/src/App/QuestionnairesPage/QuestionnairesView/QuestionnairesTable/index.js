import React, { useState } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";

import { SORT_ORDER } from "constants/sort-order.js";

import Row from "./Row";
import TableHead from "components/Table/TableHead";
import Table from "components/Table/Table";
import Panel from "components/Panel";

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
      <Table>
        <TableHead
          onSortClick={onSortQuestionnaires}
          onReverseClick={onReverseSort}
          sortOrder={sortOrder}
          currentSortColumn={sortColumn}
        />
        <tbody>
          {questionnaires.map((questionnaire, index) => {
            return (
              <Row
                key={questionnaire.id}
                autoFocus={questionnaire.id === autoFocusId}
                questionnaire={questionnaire}
                onDeleteQuestionnaire={onDeleteQuestionnaire}
                onDuplicateQuestionnaire={onDuplicateQuestionnaire}
                onLockQuestionnaire={handleLock}
                isLastOnPage={questionnaires.length === index + 1}
                data-test="questionnaires-row"
              />
            );
          })}
        </tbody>
      </Table>

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
