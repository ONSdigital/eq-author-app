import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";

import { SORT_ORDER } from "../constants";

import Row from "./Row";
import TableHead from "./TableHead";
import Panel from "components/Panel";

import { useQuestionnaireLockingModal } from "components/modals/QuestionnaireLockingModal";

const Table = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
`;

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
