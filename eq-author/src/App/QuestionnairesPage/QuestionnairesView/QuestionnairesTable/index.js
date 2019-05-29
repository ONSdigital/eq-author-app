import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { TransitionGroup } from "react-transition-group";
import gql from "graphql-tag";

import { colors } from "constants/theme";

import Row from "./Row";

const Table = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
`;

const TH = styled.th`
  padding: 1em;
  color: ${colors.darkGrey};
  width: ${props => props.colWidth};
  border-bottom: 1px solid #e2e2e2;
  font-weight: normal;
  font-size: 0.9em;
`;

TH.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

const Panel = styled.div`
  background: white;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const QuestionnairesTable = ({
  questionnaires,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  autoFocusId,
}) => {
  return (
    <Panel>
      <Table>
        <thead>
          <tr>
            <TH colWidth="35%">Title</TH>
            <TH colWidth="15%">Created</TH>
            <TH colWidth="15%">Modified</TH>
            <TH colWidth="20%">Owner</TH>
            <TH colWidth="15%">Actions</TH>
          </tr>
        </thead>
        <TransitionGroup component="tbody">
          {questionnaires.map((questionnaire, index) => {
            return (
              <Row
                key={questionnaire.id}
                autoFocus={questionnaire.id === autoFocusId}
                questionnaire={questionnaire}
                onDeleteQuestionnaire={onDeleteQuestionnaire}
                onDuplicateQuestionnaire={onDuplicateQuestionnaire}
                isLastOnPage={questionnaires.length === index + 1}
              />
            );
          })}
        </TransitionGroup>
      </Table>
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
      createdAt
      updatedAt
      createdBy {
        id
        name
      }
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
};

export default QuestionnairesTable;
