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

const StyledTableBody = styled(TableBody)`
  background-color: white;
`;

const buildOptionRow = (option, questionType) => {
  const { id, label, qCode } = option;

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

const buildQuestionRows = page => {
  const rowBuilder = [];
  const { id: key, alias, title, answers } = page;
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
  rowBuilder.push(
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

  if (options && type !== RADIO) {
    for (const option of options) {
      const optionRow = buildOptionRow(option, `${type} option`);
      rowBuilder.push(optionRow);
    }
  }

  if (mutuallyExclusiveOption) {
    const optionRow = buildOptionRow(
      mutuallyExclusiveOption,
      `Mutually exclusive ${type.toLowerCase()}`
    );
    rowBuilder.push(optionRow);
  }

  if (type === DATE_RANGE) {
    rowBuilder.push(
      <Row
        collapsed
        key={`${key}-secondary`}
        id={id}
        type={`${type}`}
        label={secondaryLabel}
        qCode={secondaryQCode}
      />
    );
  }

  return rowBuilder;
};

const buildContent = sections => {
  const content = [];

  for (const section of sections) {
    const pages = section.pages;

    const rows = pages.map(page => {
      const rowBuilder = [];
      const numOfAnswersOnPage = page.answers.length;

      rowBuilder.push(buildQuestionRows(page));

      if (numOfAnswersOnPage > 1) {
        for (let i = 1; i < numOfAnswersOnPage; i++) {
          const { answers } = page;
          const { id, type, label, qCode, options } = answers[i];

          rowBuilder.push(
            <Row
              collapsed
              key={id}
              id={id}
              type={type}
              label={label}
              qCode={qCode}
            />
          );

          if (options) {
            for (const option of options) {
              const optionRow = buildOptionRow(option, `${type} option`);
              rowBuilder.push(optionRow);
            }
          }
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

    const handleBlur = () => {};
    return (
      <>
        <SpacedTableColumn>{type}</SpacedTableColumn>
        <SpacedTableColumn>{label}</SpacedTableColumn>
        <SpacedTableColumn>
          <TableInput
            value={qCode}
            onChange={e => setQcode(e.value)}
            onBlur={() => {
              if (type.includes("option")) {
                console.log(qCode);
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
                console.log(qCode, id);
                updateAnswer({ variables: { input: { id, qCode } } });
              }
            }}
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
        <SpacedTableColumn colSpan={2} />
        {renderGlobalColumns()}
      </TableRow>
    );
  }

  return (
    <TableRow>
      <SpacedTableColumn>{alias}</SpacedTableColumn>
      <SpacedTableColumn>
        {title.replace(/(<([^>]+)>)/gi, "")}
      </SpacedTableColumn>
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
