import React, { useState } from "react";
import styled from "styled-components";
import { withApollo, Query, useMutation } from "react-apollo";
import PropTypes from "prop-types";
import { DATE_RANGE, RADIO } from "constants/answer-types";
import GET_ALL_ANSWERS from "./GetAllAnswers.graphql";
import UPDATE_ANSWER_QCODE from "./UpdateAnswerMutation.graphql";
import UPDATE_OPTION_QCODE from "./UpdateOptionMutation.graphql";

import { colors } from "constants/theme";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableColumn,
  TableHeadColumn,
} from "components/datatable/Elements";
import { TableInput } from "components/datatable/Controls";
import Loading from "components/Loading";
import Error from "components/Error";

const SpacedTableColumn = styled(TableColumn)`
  padding: 0.5em;
  color: ${colors.darkGrey};
  word-break: break-word;
`;

const EmptyTableColumn = styled(TableColumn)`
  background-color: ${colors.black};
`;

const StyledTableBody = styled(TableBody)`
  background-color: white;
`;

const buildOptionRow = (option, questionType) => {
  let { id, label, qCode } = option;

  if (questionType === DATE_RANGE) {
    id = `${id}-secondary`;
  }

  return (
    <Row
      collapsed
      key={id}
      id={id}
      type={questionType}
      label={label}
      qCode={qCode}
    />
  );
};

const removeHtml = html => html.replace(/(<([^>]+)>)/gi, "");
const buildQuestionRows = page => {
  const rowBuilder = [];
  const { id: key, alias, title, answers, confirmation } = page;
  const {
    id,
    type,
    label,
    secondaryLabel,
    qCode,
    secondaryQCode,
    options,
    mutuallyExclusiveOption,
  } = answers[0];

  const initalRow = (
    <Row
      key={key}
      id={id}
      alias={alias}
      title={title}
      type={type}
      label={label}
      qCode={qCode}
    />
  );
  rowBuilder.push(initalRow);

  const optionBuilder = (options, questionType, array) => {
    for (const option of options) {
      const optionRow = buildOptionRow(option, `${questionType} option`);
      array.push(optionRow);
    }
  };
  if (answers.length > 1) {
    for (let i = 1; i < answers.length; i++) {
      const { type, options } = answers[i];
      const extraAnswerRow = buildOptionRow(answers[i], type);
      rowBuilder.push(extraAnswerRow);

      if (options) {
        optionBuilder(options, type, rowBuilder);
      }
    }
  }
  if (confirmation) {
    const { id, displayName: title, qCode, __typename: type } = confirmation;
    const label = "";
    const confirmationRow = (
      <Row
        key={id}
        id={id}
        alias={alias}
        title={title}
        type={type}
        label={label}
        qCode={qCode}
      />
    );
    rowBuilder.push(confirmationRow);
  }

  if (options && type !== RADIO) {
    optionBuilder(options, type, rowBuilder);
  }

  if (mutuallyExclusiveOption) {
    const mutuallyExclusiveType = `Mutually exclusive ${type.toLowerCase()}`;
    const optionRow = buildOptionRow(
      mutuallyExclusiveOption,
      mutuallyExclusiveType
    );
    rowBuilder.push(optionRow);
  }

  if (type === DATE_RANGE) {
    const dateRangeOption = {
      key,
      id,
      label: secondaryLabel,
      qCode: secondaryQCode,
    };
    const dateRangeRow = buildOptionRow(dateRangeOption, type);
    rowBuilder.push(dateRangeRow);
  }

  return rowBuilder;
};

const buildContent = sections => {
  const content = [];

  for (const section of sections) {
    const pages = section.pages;

    const rows = pages.map(page => {
      const rowBuilder = [];
      const { answers, summaryAnswers } = page;

      if (answers) {
        const numberOfAnswers = answers.length;
        if (numberOfAnswers) {
          const questionRow = buildQuestionRows(page);
          rowBuilder.push(questionRow);
        }
      } else if (summaryAnswers) {
        const numberOfAnswers = summaryAnswers.length;
        if (numberOfAnswers) {
          const {
            id,
            alias,
            title,
            pageType: type,
            totalTitle: label,
            qCode,
          } = page;
          const stripLabel = removeHtml(label);
          const calculatedSummary = (
            <Row
              key={id}
              id={id}
              alias={alias}
              title={title}
              type={type}
              label={stripLabel}
              qCode={qCode}
            />
          );

          rowBuilder.push(calculatedSummary);
        }
      }

      return rowBuilder;
    });

    content.push(rows);
  }

  return content;
};

const Row = ({
  id,
  alias,
  title,
  type,
  label,
  qCode: initialQcode,
  collapsed,
}) => {
  const renderGlobalColumns = () => {
    const [qCode, setQcode] = useState(initialQcode);
    const [updateOption] = useMutation(UPDATE_OPTION_QCODE);
    const [updateAnswer] = useMutation(UPDATE_ANSWER_QCODE);

    const handleBlur = (type, id, qCode) => {
      if (type.includes("option")) {
        updateOption({ variables: { input: { id, qCode } } });
      } else if (type.includes(DATE_RANGE)) {
        if (collapsed) {
          updateAnswer({
            variables: { input: { id, secondaryQCode: qCode } },
          });
        } else {
          updateAnswer({
            variables: { input: { id, qCode } },
          });
        }
      } else {
        updateAnswer({ variables: { input: { id, qCode } } });
      }
    };

    return (
      <>
        <SpacedTableColumn>{type}</SpacedTableColumn>
        <SpacedTableColumn>{label}</SpacedTableColumn>
        <SpacedTableColumn>
          <TableInput
            value={qCode}
            onChange={e => setQcode(e.value)}
            onBlur={() => handleBlur(type, id, qCode)}
            name={`${id}-qcode-entry`}
            data-test={`${id}-test-input`}
          />
        </SpacedTableColumn>
      </>
    );
  };

  if (collapsed) {
    return (
      <TableRow>
        <EmptyTableColumn colSpan={2} />
        {renderGlobalColumns()}
      </TableRow>
    );
  }
  const stripTitle = removeHtml(title);
  return (
    <TableRow>
      <SpacedTableColumn>{alias}</SpacedTableColumn>
      <SpacedTableColumn>{stripTitle}</SpacedTableColumn>
      {renderGlobalColumns()}
    </TableRow>
  );
};

Row.propTypes = {
  id: PropTypes.string.isRequired,
  alias: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  qCode: PropTypes.string,
  collapsed: PropTypes.bool,
};

export const UnwrappedQCodeTable = ({ loading, error, data }) => {
  if (loading) {
    return <Loading height="38rem">Page loading…</Loading>;
  }

  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }

  if (data) {
    const { sections } = data.questionnaire;
    return (
      <Table data-test="qcodes-table">
        <TableHead>
          <TableRow>
            <TableHeadColumn width="20%">Short code</TableHeadColumn>
            <TableHeadColumn width="20%">Question</TableHeadColumn>
            <TableHeadColumn width="20%">Type</TableHeadColumn>
            <TableHeadColumn width="20%">Answer label</TableHeadColumn>
            <TableHeadColumn width="20%">Qcode</TableHeadColumn>
          </TableRow>
        </TableHead>
        <StyledTableBody>{buildContent(sections)}</StyledTableBody>
      </Table>
    );
  }
};

export default withApollo(props => (
  <Query
    query={GET_ALL_ANSWERS}
    variables={{
      input: {
        questionnaireId: props.questionnaireId,
      },
    }}
    fetchPolicy="no-cache"
  >
    {innerprops => <UnwrappedQCodeTable {...innerprops} {...props} />}
  </Query>
));
