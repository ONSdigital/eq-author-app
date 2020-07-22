import React, { useState, useCallback } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { withApollo, Query, useMutation } from "react-apollo";

import GET_ALL_ANSWERS from "./getAllAnswers.graphql";
import UPDATE_ANSWER_QCODE from "./updateAnswerMutation.graphql";
import UPDATE_OPTION_QCODE from "./updateOptionMutation.graphql";
import UPDATE_CONFIRMATION_QCODE from "./updateConfirmationQCode.graphql";
import UPDATE_CALCSUM_QCODE from "./updateCalculatedSummary.graphql";

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

import { colors } from "constants/theme";

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

const organiseTableContent = sections => {
  const questions = sections.reduce(
    (acc, section) => [...acc, ...section.pages],
    []
  );

  let answerRows = [];

  for (const item of questions) {
    const {
      title,
      alias,
      answers,
      confirmation,
      summaryAnswers: calculatedSummary,
    } = item;

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
      const { id, title, alias, qCode, __typename: type } = confirmation;

      answerRows.push({
        title: title,
        alias,
        answers: [{ id, qCode, type }],
      });
    }

    if (calculatedSummary && calculatedSummary.length) {
      const {
        id,
        pageType: type,
        alias,
        title,
        qCode,
        totalTitle,
        summaryAnswers,
      } = item;

      const label = removeHtml(totalTitle);
      answerRows.push({
        title,
        alias,
        answers: [{ id, type, qCode, label, summaryAnswers }],
      });
    }
  }

  // TODO
  // add qcode array here

  const qCodes = answerRows.reduce((acc, item) => {
    const codes = item.answers.map(ans => ({ id: ans.id, qCode: ans.qCode }));
    return [...acc, ...codes];
  }, []);
  return { answers: answerRows, qCodes };
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
  if (questionMatrix[type] === "Confirmation question") {
    updateConfirmation(mutationVariables({ id, qCode }));
  } else if (questionMatrix[type] === "Calculated summary") {
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

const NewRow = ({
  title,
  alias,
  id,
  label,
  qCode: initialQcode,
  type,
  index,
  qCodeCheck,
  error,
}) => {
  // const NewRow = ({ title, alias, answer, index, qCodeCheck, error }) => {
  // console.log("Render: row", answer);
  // const { id, type, label, qCode: initialQcode } = answer;

  const commonFields = useCallback(
    fields => {
      // const commonFields = fields => {
      // const { id, type, label, qCode: initialQcode } = fields;
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
          qCodeCheck({ id, qCode });
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
          <SpacedTableColumn>
            <TableInput
              value={qCode}
              onChange={e => setQcode(e.value)}
              onBlur={() => handleBlur(id, type, qCode)}
              name={`${id || ""}-qcode-entry`}
              data-test={`${id || ""}-test-input`}
            />
            {/* this doesn't work yet */}
            {/* {error.includes(id) && <div>Oh no error</div>} */}
          </SpacedTableColumn>
        </>
      );
    },
    [initialQcode]
  );

  if (index > 0) {
    return (
      <TableRow key={`${id}-${index}`}>
        <EmptyTableColumn />
        <EmptyTableColumn />
        {commonFields({ id, type, label, initialQcode })}
      </TableRow>
    );
  }
  const stripTitle = removeHtml(title);
  return (
    <TableRow key={`${id}-${index}`}>
      <SpacedTableColumn>{alias}</SpacedTableColumn>
      <SpacedTableColumn>{stripTitle}</SpacedTableColumn>
      {commonFields({ id, type, label, initialQcode })}
    </TableRow>
  );
};

const RowBuilder = sections => {
  const { answers } = organiseTableContent(sections);
  const flatten = flattenAnswers(answers);

  // by flattening here can pull out relevant data
  // makes it easy to check for duplicates

  // Data needs to be saved into state
  // and state needs to be updated when an error is present
  // Need to pass a handler from here

  /*
  const handler () => {
    // check when qCode has updated and the id of the row item
    // only update the state if it's different
    // set the state
  }

  */

  return flatten.map((item, index) => (
    <NewRow key={`${item.id}-${index}`} {...item} />
  ));
  // want to memo the the component and check to see if there is an error present of the qCode has changed.
};

// need to remove the handleBlur from here
const Row = ({ item: { title, alias, answers }, qCodeCheck, error }) => {
  const commonFields = useCallback(
    fields => {
      // const commonFields = fields => {
      const { id, type, label, qCode: initialQcode } = fields;
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
          if (initialQcode !== qCode) {
            qCodeCheck({ id, qCode });
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
          <SpacedTableColumn>
            <TableInput
              value={qCode}
              onChange={e => setQcode(e.value)}
              onBlur={() => handleBlur(id, type, qCode)}
              name={`${id || ""}-qcode-entry`}
              data-test={`${id || ""}-test-input`}
            />
            {error.includes(id) && <div>Oh no error</div>}
          </SpacedTableColumn>
        </>
      );
    },
    [answers]
  );

  return (
    <>
      {answers.map((answer, index) => {
        if (index > 0) {
          console.log("Render: more than first item");
          return (
            <TableRow key={`${answer.id}-${index}`}>
              <EmptyTableColumn />
              <EmptyTableColumn />
              {commonFields(answer)}
            </TableRow>
          );
        }
        const stripTitle = removeHtml(title);
        console.log("Render: first item");
        return (
          <TableRow key={`${answer.id}-${answer.qCode}`}>
            <SpacedTableColumn>{alias}</SpacedTableColumn>
            <SpacedTableColumn>{stripTitle}</SpacedTableColumn>
            {commonFields(answer)}
          </TableRow>
        );
      })}
    </>
  );
};

// need handle qCodes from here and duplicate checker
// duplicate check is rough and needs some polish
const buildTableRows = data => {
  const { answers, qCodes } = organiseTableContent(data);

  const [codes, setQCodes] = useState(qCodes);

  const handleQCodes = item => {
    let hasChanged;

    const updatedQCodes = codes.map(code => {
      if (code.id === item.id) {
        if (code.qCode !== item.qCode) {
          hasChanged = true;
          return { ...code, ...{ qCode: item.qCode } };
        }
        hasChanged = false;
      }
      return code;
    });
    if (hasChanged) {
      setQCodes(updatedQCodes);
    }
  };

  const duplicateCheck = { values: [], tempDuplicates: [] };

  const { tempDuplicates } = codes.reduce((acc, item) => {
    if (acc.values.includes(item.qCode)) {
      acc.tempDuplicates.push(item.qCode);
    }
    if (!acc.values.includes(item.id)) {
      acc.values.push(item.qCode);
    }
    return acc;
  }, duplicateCheck);

  const duplicates = codes
    .filter(code => tempDuplicates.includes(code.qCode))
    .map(code => code.id);

  return (
    <>
      {answers.map((item, index) => {
        return (
          <Row
            key={index}
            item={item}
            index={index}
            error={duplicates}
            qCodeCheck={handleQCodes}
          />
        );
      })}
    </>
  );
};

Row.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    alias: PropTypes.string,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        label: PropTypes.string,
        qCode: PropTypes.string,
      })
    ),
  }),
};

export const UnwrappedQCodeTable = ({ loading, error, data }) => {
  const TableError = <Error>Oops! Something went wrong</Error>;

  if (loading) {
    return <Loading height="38rem">Page loading…</Loading>;
  }

  if (error) {
    return TableError;
  }

  const { sections } = data.questionnaire;

  // needs a better name (for function and var)
  const test = RowBuilder(sections);

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
      <StyledTableBody>{test}</StyledTableBody>
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
