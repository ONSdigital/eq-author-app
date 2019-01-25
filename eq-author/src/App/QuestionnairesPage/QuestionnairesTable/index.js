import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { sortBy, get, reverse, map } from "lodash";
import gql from "graphql-tag";
import scrollIntoView from "utils/scrollIntoView";
import iconArrow from "./icon-arrow-down.svg";
import Row from "App/QuestionnairesPage/QuestionnairesTable/Row";

const ASC = "ascending";
const DESC = "descending";

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

const SortButton = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;

  &::after {
    content: url(${iconArrow});
    display: inline-block;
    width: 16px;
    height: 16px;
    opacity: ${props => (props.active ? "0.8" : "0.2")};
    transform: rotate(${props => (props.order === DESC ? "0deg" : "180deg")});
  }
`;

const SortableTH = ({
  children,
  sortBy,
  sortOrder,
  sortKey,
  onClick,
  ...otherProps
}) => {
  const active = sortKey === sortBy;

  return (
    <TH aria-sort={active ? sortOrder : "none"} {...otherProps}>
      <SortButton
        active={active}
        order={active ? sortOrder : DESC}
        role="button"
        onClick={() => {
          onClick(sortKey);
        }}
      >
        {children}
      </SortButton>
    </TH>
  );
};

const TableHead = props => {
  return (
    <thead>
      <tr>
        <SortableTH sortKey="title" colWidth="40%" {...props}>
          Title
        </SortableTH>
        <SortableTH sortKey="createdAt" colWidth="10%" {...props}>
          Created
        </SortableTH>
        <SortableTH sortKey="modifiedAt" colWidth="10%" {...props}>
          Modified
        </SortableTH>
        <SortableTH sortKey="createdBy.id" colWidth="10%" {...props}>
          Created by
        </SortableTH>
        <TH colWidth="10%" />
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
    sort: {
      by: "title",
      order: ASC,
    },
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
    let order;

    if (this.state.sort.by === sortKey) {
      order = this.state.sort.order === ASC ? DESC : ASC;
    } else {
      order = ASC;
    }

    this.setState({
      sort: {
        by: sortKey,
        order,
      },
    });
  };

  render() {
    const { questionnaires } = this.props;
    const { sort, focusedId } = this.state;
    let sortedQuestionnaires = sortBy(questionnaires, q =>
      get(q, this.state.sort.by).toLowerCase()
    );

    if (sort.order === DESC) {
      sortedQuestionnaires = reverse(sortedQuestionnaires);
    }

    return (
      <Table role="grid">
        <TableHead
          onClick={this.handleSortClick}
          sortBy={sort.by}
          sortOrder={sort.order}
        />
        <TBody>
          {map(sortedQuestionnaires, (questionnaire, index) => {
            const dupe = questionnaire.id.startsWith("dupe");

            return (
              <Row
                odd={index % 2}
                key={questionnaire.id}
                dupe={dupe}
                autoFocus={questionnaire.id === focusedId}
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
