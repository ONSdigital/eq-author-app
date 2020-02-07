import React, { useState } from "react";
import styled from "styled-components";
import { withApollo, Query, useMutation } from "react-apollo";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { DATE_RANGE, RADIO } from "constants/answer-types";
import GET_ALL_ANSWERS from "./getAllAnswers.graphql";
import UPDATE_ANSWER_QCODE from "./updateAnswerMutation.graphql";
import UPDATE_OPTION_QCODE from "./updateOptionMutation.graphql";
import UPDATE_CONFIRMATION_QCODE from "./updateConfirmationQCode.graphql";
import UPDATE_CALCSUM_QCODE from "./updateCalculatedSummary.graphql";

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
  background-color: ${colors.lightMediumGrey};
`;

const StyledTableBody = styled(TableBody)`
  background-color: white;
`;

const buildOptionRow = (option, questionType, secondary = false) => {
  const { id, label, qCode } = option;
  let key = id;

  if (questionType === DATE_RANGE && secondary) {
    key = `${id}-secondary`;
  }
  return (
    <Row
      collapsed
      key={key}
      id={id}
      type={questionType}
      label={label}
      qCode={qCode}
      secondary={secondary}
    />
  );
};

const removeHtml = html => html && html.replace(/(<([^>]+)>)/gi, "");

const builtRows = page => {
  const rowBuilder = [];
  const { id: key, alias, title, answers, confirmation } = page;
  const {
    id,
    type,
    label,
    qCode,
    options,
    mutuallyExclusiveOption,
  } = answers[0];

  const optionBuilder = (options, questionType, array) => {
    for (const option of options) {
      const optionRow = buildOptionRow(option, `${questionType} option`);
      array.push(optionRow);
    }
  };
  const mutuallyExclusiveBuilder = (option, questionType, array) => {
    const mutuallyExclusiveType = `Mutually exclusive ${questionType.toLowerCase()}`;
    const optionRow = buildOptionRow(option, mutuallyExclusiveType);
    array.push(optionRow);
  };
  const dateRangeBuilder = (option, questionType, array) => {
    const { key, id, secondaryLabel, secondaryQCode } = option;
    const dateRangeOption = {
      key,
      id,
      label: secondaryLabel,
      qCode: secondaryQCode,
    };
    const secondaryOption = true;
    const dateRangeRow = buildOptionRow(
      dateRangeOption,
      questionType,
      secondaryOption
    );
    array.push(dateRangeRow);
  };

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

  if (options && type !== RADIO) {
    optionBuilder(options, type, rowBuilder);
  }

  if (mutuallyExclusiveOption) {
    mutuallyExclusiveBuilder(mutuallyExclusiveOption, type, rowBuilder);
  }
  if (type === DATE_RANGE) {
    dateRangeBuilder(answers[0], type, rowBuilder);
  }

  if (answers.length > 1) {
    for (let i = 1; i < answers.length; i++) {
      const { type, options, mutuallyExclusiveOption } = answers[i];
      const extraAnswerRow = buildOptionRow(answers[i], type);
      rowBuilder.push(extraAnswerRow);

      if (options && type !== RADIO) {
        optionBuilder(options, type, rowBuilder);
      }

      if (mutuallyExclusiveOption) {
        mutuallyExclusiveBuilder(mutuallyExclusiveOption, type, rowBuilder);
      }

      if (type === DATE_RANGE) {
        dateRangeBuilder(answers[i], type, rowBuilder);
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
          const questionRow = builtRows(page);
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
          const summaryIDs = summaryAnswers.map(answer => answer.id);
          const stripLabel = removeHtml(label) || "";
          const calculatedSummary = (
            <Row
              key={id}
              id={id}
              alias={alias}
              title={title}
              type={type}
              label={stripLabel}
              qCode={qCode || ""}
              summaryAnswers={summaryIDs}
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
  summaryAnswers = null,
  secondary,
}) => {
  const renderGlobalColumns = () => {
    const [qCode, setQcode] = useState(initialQcode);
    const [updateOption] = useMutation(UPDATE_OPTION_QCODE);
    const [updateAnswer] = useMutation(UPDATE_ANSWER_QCODE);
    const [updateConfirmation] = useMutation(UPDATE_CONFIRMATION_QCODE);
    const [updateCalculatedSummaryPage] = useMutation(UPDATE_CALCSUM_QCODE);

    const handleBlur = (type, id, qCode) => {
      if (type === "QuestionConfirmation") {
        updateConfirmation({
          variables: { input: { id, qCode } },
        });
      } else if (type === "CalculatedSummaryPage") {
        updateCalculatedSummaryPage({
          variables: { input: { id, qCode, summaryAnswers } },
        });
      } else if (type.includes("option")) {
        updateOption({ variables: { input: { id, qCode } } });
      } else if (type.includes("Mutually exclusive")) {
        updateOption({ variables: { input: { id, qCode } } });
      } else if (type.includes(DATE_RANGE)) {
        if (collapsed && secondary) {
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
        <EmptyTableColumn />
        <EmptyTableColumn />
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
  secondary: PropTypes.bool,
  summaryAnswers: PropTypes.arrayOf(PropTypes.string),
};

export const UnwrappedQCodeTable = ({ loading, error, data }) => {
  if (loading) {
    return <Loading height="38rem">Page loading…</Loading>;
  }

  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }

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
};

UnwrappedQCodeTable.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object, //eslint-disable-line
  data: PropTypes.shape({
    questionnaire: CustomPropTypes.questionnaire,
  }),
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
