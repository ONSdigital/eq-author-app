import React, { useState, useCallback, memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";

import { stripHtmlToText } from "utils/stripHTML";
import UPDATE_ANSWER_QCODE from "graphql/updateAnswer.graphql";
import UPDATE_OPTION_QCODE from "graphql/updateOption.graphql";
import UPDATE_LIST_COLLECTOR_PAGE from "graphql/updateListCollector.graphql";

import { useQCodeContext } from "components/QCodeContext";
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
  RADIO_OPTION,
  CHECKBOX_OPTION,
  MUTUALLY_EXCLUSIVE,
  MUTUALLY_EXCLUSIVE_OPTION,
  SELECT,
  SELECT_OPTION,
} from "constants/answer-types";

import { DRIVING, ADDITIONAL } from "constants/list-answer-types";

import {
  QCODE_IS_NOT_UNIQUE,
  QCODE_REQUIRED,
} from "constants/validationMessages";

const SpacedTableColumn = styled(TableColumn)`
  padding: 0.5em 0.5em 0.2em;
  color: ${colors.text};
  word-break: break-word;
`;

const ErrorWrappedInput = styled(TableInput)`
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.errorPrimary};
    outline-color: ${colors.errorPrimary};
    box-shadow: 0 0 0 2px ${colors.errorPrimary};
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

const TYPE_TO_DESCRIPTION = {
  [RADIO_OPTION]: "Radio option",
  [CHECKBOX_OPTION]: "Checkbox option",
  [SELECT_OPTION]: "Select option",
  [MUTUALLY_EXCLUSIVE_OPTION]: "Mutually exclusive option",
  [MUTUALLY_EXCLUSIVE]: "Mutually exclusive",
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
  [SELECT]: "Select",
};

const mutationVariables = (inputValues) => ({
  variables: {
    input: {
      ...inputValues,
    },
  },
});

const Row = memo((props) => {
  const {
    dataVersion,
    id,
    questionTitle,
    questionShortCode,
    label,
    qCode: initialQcode,
    type,
    errorMessage,
    option,
    secondary,
    listAnswerType,
    drivingQCode,
    anotherQCode,
  } = props;

  // Uses different initial QCode depending on the QCode defined in the props
  const [qCode, setQcode] = useState(
    initialQcode ?? drivingQCode ?? anotherQCode
  );
  const [updateOption] = useMutation(UPDATE_OPTION_QCODE);
  const [updateAnswer] = useMutation(UPDATE_ANSWER_QCODE);
  const [updateListCollector] = useMutation(UPDATE_LIST_COLLECTOR_PAGE);

  const handleBlur = useCallback(
    (qCode) => {
      if (qCode !== initialQcode) {
        if (option) {
          updateOption(mutationVariables({ id, qCode }));
        } else if (listAnswerType === DRIVING) {
          // id represents the list collector page ID
          updateListCollector(mutationVariables({ id, drivingQCode: qCode }));
        } else if (listAnswerType === ADDITIONAL) {
          updateListCollector(mutationVariables({ id, anotherQCode: qCode }));
        } else {
          updateAnswer(
            mutationVariables({
              id,
              [secondary ? "secondaryQCode" : "qCode"]: qCode,
            })
          );
        }
      }
    },
    [
      initialQcode,
      option,
      secondary,
      listAnswerType,
      id,
      updateAnswer,
      updateOption,
      updateListCollector,
    ]
  );

  return (
    <TableRow data-test={`answer-row-test`}>
      {questionShortCode || questionTitle ? (
        <>
          <SpacedTableColumn>{questionShortCode}</SpacedTableColumn>
          <SpacedTableColumn>
            {stripHtmlToText(questionTitle)}
          </SpacedTableColumn>
        </>
      ) : (
        <>
          <EmptyTableColumn />
          <EmptyTableColumn />
        </>
      )}
      <SpacedTableColumn>{TYPE_TO_DESCRIPTION[type]}</SpacedTableColumn>
      <SpacedTableColumn>{label}</SpacedTableColumn>
      {dataVersion === "3" ? (
        [CHECKBOX_OPTION, RADIO_OPTION, SELECT_OPTION].includes(type) ? (
          <EmptyTableColumn />
        ) : (
          <SpacedTableColumn>
            <ErrorWrappedInput
              name={`${id}-qcode-entry`}
              data-test={`${id}${secondary ? "-secondary" : ""}-test-input`}
              value={qCode}
              onChange={(e) => setQcode(e.value)}
              onBlur={() => handleBlur(qCode)}
              hasError={Boolean(errorMessage)}
            />
            {errorMessage && (
              <QcodeValidationError>{errorMessage}</QcodeValidationError>
            )}
          </SpacedTableColumn>
        )
      ) : [CHECKBOX, RADIO_OPTION, SELECT_OPTION].includes(type) ? (
        <EmptyTableColumn />
      ) : (
        <SpacedTableColumn>
          <ErrorWrappedInput
            name={`${id}-qcode-entry`}
            data-test={`${id}${secondary ? "-secondary" : ""}-test-input`}
            value={qCode}
            onChange={(e) => setQcode(e.value)}
            onBlur={() => handleBlur(qCode)}
            hasError={Boolean(errorMessage)}
          />
          {errorMessage && (
            <QcodeValidationError>{errorMessage}</QcodeValidationError>
          )}
        </SpacedTableColumn>
      )}
    </TableRow>
  );
});

Row.propTypes = {
  dataVersion: PropTypes.string,
  id: PropTypes.string,
  questionTitle: PropTypes.string,
  questionShortCode: PropTypes.string,
  label: PropTypes.string,
  qCode: PropTypes.string,
  type: PropTypes.string,
  qCodeCheck: PropTypes.func,
  errorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  secondary: PropTypes.bool,
  option: PropTypes.bool,
};

export const QCodeTable = () => {
  const { answerRows, duplicatedQCodes, dataVersion } = useQCodeContext();
  const getErrorMessage = (qCode) =>
    (!qCode && QCODE_REQUIRED) ||
    (duplicatedQCodes.includes(qCode) && QCODE_IS_NOT_UNIQUE);

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
      <StyledTableBody>
        {answerRows?.map((item, index) => {
          if (
            item.additionalAnswer &&
            (dataVersion === "3" || item.type !== "CheckboxOption")
          ) {
            return (
              <>
                <Row
                  key={`${item.id}-${index}`}
                  dataVersion={dataVersion}
                  {...item}
                  errorMessage={getErrorMessage(item.qCode)}
                />
                <Row
                  key={`${item.additionalAnswer.id}-${index}`}
                  dataVersion={dataVersion}
                  {...item.additionalAnswer}
                  errorMessage={getErrorMessage(item.additionalAnswer.qCode)}
                />
              </>
            );
          } else {
            return (
              <Row
                key={`${item.id}-${index}`}
                dataVersion={dataVersion}
                {...item}
                errorMessage={getErrorMessage(
                  item.qCode ?? item.drivingQCode ?? item.anotherQCode // Uses a different QCode depending on the QCode defined in item
                )}
              />
            );
          }
        })}
      </StyledTableBody>
    </Table>
  );
};

export default QCodeTable;
