import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { sortBy, get } from "lodash";
import gql from "graphql-tag";
import scrollIntoView from "utils/scrollIntoView";
import IconArrow from "./icon-arrow-down.svg?inline";
import Row from "App/QuestionnairesPage/QuestionnairesTable/Row";

const Table = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
`;

const TH = styled.th`
  padding: 1em;
  color: #666;
  width: ${props => props.colWidth};
  border-bottom: 1px solid #e2e2e2;
  font-weight: normal;
  font-size: 0.9em;
`;

const SortableWrapper = styled.span`
  display: flex;
  cursor: pointer;
`;

const Sortable = ({ children, onClick, sortKey }) => {
  return (
    <SortableWrapper onClick={() => onClick(sortKey)}>
      {children}
      <IconArrow />
    </SortableWrapper>
  );
};

const TableHead = ({ onSortClick }) => {
  return (
    <thead>
      <tr>
        <TH colWidth="40%">
          <Sortable onClick={onSortClick} sortKey="title">
            Title
          </Sortable>
        </TH>
        <TH colWidth="15%">
          <Sortable onClick={onSortClick} sortKey="createdAt">
            Created
          </Sortable>
        </TH>
        <TH colWidth="15%">
          <Sortable onClick={onSortClick} sortKey="createdAt">
            Modified
          </Sortable>
        </TH>
        <TH colWidth="15%">
          <Sortable onClick={onSortClick} sortKey="createdBy.id">
            Created by
          </Sortable>
        </TH>
      </tr>
    </thead>
  );
};

const TBody = props => <tbody {...props} />;

export class UnconnectedQuestionnairesTable extends React.PureComponent {
  static propTypes = {
    questionnaires: CustomPropTypes.questionnaireList,
    onDeleteQuestionnaire: PropTypes.func.isRequired,
    onDuplicateQuestionnaire: PropTypes.func.isRequired,
  };

  static fragments = {
    QuestionnaireDetails: gql`
      fragment QuestionnaireDetails on Questionnaire {
        id
        title
        createdAt
        createdBy {
          id
          name
        }
      }
    `,
  };

  headRef = React.createRef();

  state = {
    focusedId: null,
    sortKey: "title",
  };

  handleDuplicateQuestionnaire = questionnaire => {
    scrollIntoView(this.headRef.current);
    this.props
      .onDuplicateQuestionnaire(questionnaire)
      .then(duplicateQuestionnaire => {
        this.setState({ focusedId: duplicateQuestionnaire.id });
      });
  };

  handleDeleteQuestionnaire = questionnaireId => {
    const { questionnaires } = this.props;
    const possibleNextIndex =
      questionnaires.indexOf(
        questionnaires.find(q => q.id === questionnaireId)
      ) + 1;

    // If the last one is being removed then focus the one before that
    const nextIndex =
      possibleNextIndex > questionnaires.length - 1
        ? questionnaires.length - 2
        : possibleNextIndex;

    // We have to account to set focusedId to undefined when there are no
    // questionnaires left
    this.setState({
      focusedId: (questionnaires[nextIndex] || {}).id,
    });

    this.props.onDeleteQuestionnaire(questionnaireId);
  };

  handleSortClick = sortKey => {
    this.setState({ sortKey });
  };

  render() {
    const { questionnaires } = this.props;

    return (
      <Table>
        <TableHead onSortClick={this.handleSortClick} />
        <TBody>
          {sortBy(questionnaires, q =>
            get(q, this.state.sortKey).toLowerCase()
          ).map((questionnaire, index) => {
            const dupe = questionnaire.id.startsWith("dupe");

            return (
              <Row
                odd={index % 2}
                key={questionnaire.id}
                dupe={dupe}
                autoFocus={questionnaire.id === this.state.focusedId}
                questionnaire={questionnaire}
                onDeleteQuestionnaire={this.handleDeleteQuestionnaire}
                onDuplicateQuestionnaire={this.handleDuplicateQuestionnaire}
              />
            );
          })}
        </TBody>
      </Table>
    );
  }
}

export default UnconnectedQuestionnairesTable;
