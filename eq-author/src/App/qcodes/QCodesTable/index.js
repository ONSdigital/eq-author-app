import React, { useState, useCallback, memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { withApollo, Query, useMutation } from "react-apollo";
import { find, get } from "lodash";

import GET_ALL_ANSWERS from "./graphql/getAllAnswers.graphql";
import UPDATE_ANSWER_QCODE from "./graphql/updateAnswerMutation.graphql";
import UPDATE_OPTION_QCODE from "./graphql/updateOptionMutation.graphql";
import UPDATE_CONFIRMATION_QCODE from "./graphql/updateConfirmationQCode.graphql";
import UPDATE_CALCSUM_QCODE from "./graphql/updateCalculatedSummary.graphql";

import Loading from "components/Loading";
import Error from "components/Error";
import ValidationError from "components/ValidationError";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableColumn,
  TableHeadColumn,
} from "components/datatable/Elements";
import { TableInput } from "components/datatable/Controls";

import { colors } from "constants/theme";
import {
  QCODE_IS_NOT_UNIQUE,
  QCODE_REQUIRED,
} from "constants/validationMessages";
import {
  CHECKBOX,
  RADIO,
  TEXTFIELD,
  TEXTAREA,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  DATE,
  DATE_RANGE,
  UNIT,
  DURATION,
} from "constants/answer-types";

const SpacedTableColumn = styled(TableColumn)`
  padding: 0.5em 0.5em 0.2em;
  color: ${colors.darkGrey};
  word-break: break-word;
`;

const ErrorWrappedInput = styled(TableInput)`
  ${({ error }) =>
    error &&
    `
    border-color: ${colors.red};
    outline-color: ${colors.red};
    box-shadow: 0 0 0 2px ${colors.red};
  `}
`;

const EmptyTableColumn = styled(TableColumn)`
  background-color: ${colors.lightMediumGrey};
`;

const StyledTableBody = styled(TableBody)`
  background-color: white;
`;

const QcodeValidationError = styled(ValidationError)`
  justify-content: unset;
  margin: 0;
  padding-top: 0.2em;
`;

const questionMatrix = {
  QuestionConfirmation: "Confirmation question",
  CalculatedSummaryPage: "Calculated summary",
  CheckboxOption: "Checkbox option",
  MutuallyExclusiveOption: "Mutually exclusive checkbox",
  [CHECKBOX]: "Checkbox",
  [RADIO]: "Radio",
  [TEXTFIELD]: "Text field",
  [TEXTAREA]: "Text area",
  [CURRENCY]: "Currency",
  [NUMBER]: "Number",
  [PERCENTAGE]: "Percentage",
  [DATE]: "Date",
  [DATE_RANGE]: "Date range",
  [UNIT]: "Unit",
  [DURATION]: "Duration",
};

const removeHtml = html => html && html.replace(/(<([^>]+)>)/gi, "");

const organiseAnswers = sections => {
  const questions = sections.reduce(
    (acc, section) => [...acc, ...section.pages],
    []
  );

  let answerRows = [];

  for (const item of questions) {
    const { title, alias, answers, confirmation } = item;

    if (answers) {
      const extraCheck = answers.reduce((acc, item) => {
        if (
          item.hasOwnProperty("options") &&
          item.options &&
          item.type !== RADIO
        ) {
          const optionLabel = item.options.map(option => ({
            ...option,
            type: "CheckboxOption",
            option: true,
          }));

          acc.push(...optionLabel);
        }

        if (
          item.hasOwnProperty("mutuallyExclusiveOption") &&
          item.mutuallyExclusiveOption
        ) {
          acc.push({
            ...item.mutuallyExclusiveOption,
            type: "MutuallyExclusiveOption",
            option: true,
          });
        }
        if (
          item.hasOwnProperty("secondaryLabel") &&
          item.hasOwnProperty("secondaryQCode") &&
          item.secondaryLabel
        ) {
          acc.push({
            id: item.id,
            label: item.secondaryLabel,
            qCode: item.secondaryQCode,
            type: item.type,
            validationErrorInfo: item.validationErrorInfo,
            secondary: true,
          });
        }
        return acc;
      }, []);

      const answersAndOptions = [...answers, ...extraCheck];

      answerRows.push({
        title,
        alias,
        answers: answersAndOptions,
      });
    }

    if (confirmation) {
      const {
        id,
        title,
        alias,
        qCode,
        validationErrorInfo,
        __typename: type,
      } = confirmation;

      answerRows.push({
        title: title,
        alias,
        answers: [{ id, qCode, type, validationErrorInfo }],
      });
    }
  }

  return { answers: answerRows };
};

const flattenAnswers = data => {
  const answers = data.reduce((acc, item) => {
    const answer = item.answers.map((ans, index) => {
      if (index > 0) {
        return {
          title: item.title,
          alias: item.alias,
          nested: true,
          ...ans,
        };
      } else {
        return {
          title: item.title,
          alias: item.alias,
          ...ans,
        };
      }
    });
    acc.push(...answer);
    return acc;
  }, []);
  return answers;
};

const handleBlurReducer = ({ type, payload, mutation }) => {
  const {
    updateConfirmation,
    updateCalculatedSummaryPage,
    updateOption,
    updateAnswer,
  } = mutation;

  const mutationVariables = inputValues => {
    return {
      variables: {
        input: {
          ...inputValues,
        },
      },
    };
  };

  const { id, qCode } = payload;

  if (questionMatrix[type] === questionMatrix.QuestionConfirmation) {
    updateConfirmation(mutationVariables({ id, qCode }));
  } else if (questionMatrix[type] === questionMatrix.CalculatedSummaryPage) {
    const summaryAnswers = payload.summaryAnswers.map(item => item.id);
    const update = { id, qCode, summaryAnswers };

    updateCalculatedSummaryPage(mutationVariables(update));
  } else if (payload.option) {
    updateOption(mutationVariables({ id, qCode }));
  } else if (payload.secondary) {
    updateAnswer(mutationVariables({ id, secondaryQCode: qCode }));
  } else {
    updateAnswer(
      mutationVariables({ id, qCode, properties: payload.properties })
    );
  }
};

const Row = memo(
  props => {
    const {
      id,
      title,
      alias,
      label,
      qCode: initialQcode,
      type,
      error,
      noValQCodeError,
    } = props;
    const commonFields = useCallback(
      fields => {
        const [qCode, setQcode] = useState(initialQcode);

        const [updateOption] = useMutation(UPDATE_OPTION_QCODE);
        const [updateAnswer] = useMutation(UPDATE_ANSWER_QCODE);
        const [updateConfirmation] = useMutation(UPDATE_CONFIRMATION_QCODE);
        const [updateCalculatedSummaryPage] = useMutation(UPDATE_CALCSUM_QCODE);

        const handleBlur = useCallback(
          (id, type, qCode) => {
            const mutation = {
              updateOption,
              updateAnswer,
              updateConfirmation,
              updateCalculatedSummaryPage,
            };
            if (qCode !== initialQcode) {
              handleBlurReducer({
                type,
                payload: { ...fields, qCode },
                mutation,
              });
            }
          },
          [id, type, qCode]
        );

        return (
          <>
            <SpacedTableColumn>{questionMatrix[type]}</SpacedTableColumn>
            <SpacedTableColumn>{label}</SpacedTableColumn>
            {type === "Checkbox" ? (
              <EmptyTableColumn />
            ) : (
              <SpacedTableColumn>
                <ErrorWrappedInput
                  value={qCode}
                  onChange={e => setQcode(e.value)}
                  onBlur={() => handleBlur(id, type, qCode)}
                  name={`${id}-qcode-entry`}
                  data-test={`${id}-test-input`}
                  error={error}
                />

                {error && (
                  <QcodeValidationError right>
                    {QCODE_IS_NOT_UNIQUE}
                  </QcodeValidationError>
                )}

                {noValQCodeError && (
                  <QcodeValidationError right>
                    {QCODE_REQUIRED}
                  </QcodeValidationError>
                )}
              </SpacedTableColumn>
            )}
          </>
        );
      },
      [initialQcode, error]
    );

    if (props.nested) {
      return (
        <TableRow data-test={`answer-row-test`}>
          <EmptyTableColumn />
          <EmptyTableColumn />
          {commonFields(props)}
        </TableRow>
      );
    }

    return (
      <TableRow data-test={`answer-row-test`}>
        <SpacedTableColumn>{alias}</SpacedTableColumn>
        <SpacedTableColumn>{removeHtml(title)}</SpacedTableColumn>
        {commonFields(props)}
      </TableRow>
    );
  },
  (prev, next) => {
    if (prev.qCode !== next.qCode || prev.error !== next.error) {
      return false;
    }

    return true;
  }
);

const RowBuilder = answers => {
  const duplicates = answers.reduce((acc, item) => {
    if (
      acc.hasOwnProperty(item.qCode) &&
      item.qCode !== "" &&
      item.qCode !== null
    ) {
      acc[item.qCode]++;
    }
    if (!acc[item.qCode]) {
      acc[item.qCode] = 1;
    }
    return acc;
  }, {});

  return answers.map((item, index) => {
    let noValQCodeError = find(
      get(item, "validationErrorInfo.errors"),
      ({ field }) => field.includes("qCode") || field.includes("secondaryQCode")
    );

    return (
      <Row
        key={`${item.id}-${index}`}
        {...item}
        error={duplicates[item.qCode] > 1}
        noValQCodeError={noValQCodeError}
      />
    );
  });
};

Row.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  alias: PropTypes.string,
  label: PropTypes.string,
  qCode: PropTypes.string,
  type: PropTypes.string,
  qCodeCheck: PropTypes.func,
  error: PropTypes.bool,
  nested: PropTypes.bool,
  noValQCodeError: PropTypes.object, // eslint-disable-line
};

export const UnwrappedQCodeTable = ({ loading, error, data }) => {
  if (loading) {
    return <Loading height="38rem">Page loading…</Loading>;
  }

  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }

  const { sections } = data.questionnaire;
  const { answers } = organiseAnswers(sections);
  const flatten = flattenAnswers(answers);

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
      <StyledTableBody>{RowBuilder(flatten)}</StyledTableBody>
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
  >
    {innerprops => <UnwrappedQCodeTable {...innerprops} {...props} />}
  </Query>
));
