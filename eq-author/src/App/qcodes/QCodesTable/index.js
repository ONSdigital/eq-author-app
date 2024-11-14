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

import { DRIVING, ANOTHER } from "constants/list-answer-types";

import {
  QCODE_IS_NOT_UNIQUE,
  QCODE_REQUIRED,
  VALUE_IS_NOT_UNIQUE,
  VALUE_REQUIRED,
} from "constants/validationMessages";

import {
  getPageByAnswerId,
  getAnswerByOptionId,
} from "utils/questionnaireUtils";
import { useQuestionnaire } from "components/QuestionnaireContext";

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

const StyledValidationError = styled(ValidationError)`
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
    value: initialValue,
    type,
    errorMessage,
    valueErrorMessage,
    option,
    secondary,
    listAnswerType,
    drivingQCode,
    anotherQCode,
    hideOptionValue,
  } = props;

  // Uses different initial QCode depending on the QCode defined in the props
  const [qCode, setQcode] = useState(
    initialQcode ?? drivingQCode ?? anotherQCode
  );
  const [updateOption] = useMutation(UPDATE_OPTION_QCODE, {
    refetchQueries: ["GetQuestionnaire"],
  });
  const [updateAnswer] = useMutation(UPDATE_ANSWER_QCODE, {
    refetchQueries: ["GetQuestionnaire"],
  });
  const [updateListCollector] = useMutation(UPDATE_LIST_COLLECTOR_PAGE, {
    refetchQueries: ["GetQuestionnaire"],
  });
  const [value, setValue] = useState(initialValue);
  const [updateValue] = useMutation(UPDATE_OPTION_QCODE, {
    refetchQueries: ["GetQuestionnaire"],
  });

  const handleBlur = useCallback(
    (qCode) => {
      const trimmedQcode = qCode.trim().replace(/\s+/g, " ");
      setQcode(trimmedQcode);
      if (qCode !== initialQcode) {
        if (option) {
          updateOption(mutationVariables({ id, qCode: trimmedQcode }));
        } else if (listAnswerType === DRIVING) {
          // id represents the list collector page ID
          updateListCollector(
            mutationVariables({ id, drivingQCode: trimmedQcode })
          );
        } else if (listAnswerType === ANOTHER) {
          updateListCollector(
            mutationVariables({ id, anotherQCode: trimmedQcode })
          );
        } else {
          updateAnswer(
            mutationVariables({
              id,
              [secondary ? "secondaryQCode" : "qCode"]: trimmedQcode,
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

  const handleBlurOptionValue = useCallback(
    (value) => {
      const trimmedValue = value.trim().replace(/\s+/g, " ");
      setValue(trimmedValue);
      updateValue(mutationVariables({ id, value: trimmedValue }));
    },
    [id, updateValue]
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
      <SpacedTableColumn>{stripHtmlToText(label)}</SpacedTableColumn>
      {dataVersion === "3" ? (
        [
          CHECKBOX_OPTION,
          RADIO_OPTION,
          SELECT_OPTION,
          MUTUALLY_EXCLUSIVE_OPTION,
        ].includes(type) ? (
          <EmptyTableColumn />
        ) : (
          <SpacedTableColumn>
            <ErrorWrappedInput
              name={`${id}-qcode-entry`}
              data-test={`${id}${secondary ? "-secondary" : ""}${
                listAnswerType === DRIVING ? "-driving" : ""
              }${listAnswerType === ANOTHER ? "-another" : ""}-test-input`}
              value={qCode || ""} // Ensure the input always has a value (empty string if qCode is null or undefined)
              onChange={(e) => setQcode(e.value)}
              onBlur={() => handleBlur(qCode)}
              hasError={Boolean(errorMessage)}
              aria-label="QCode input field"
            />
            {errorMessage && (
              <StyledValidationError>{errorMessage}</StyledValidationError>
            )}
          </SpacedTableColumn>
        )
      ) : [
          CHECKBOX,
          RADIO_OPTION,
          SELECT_OPTION,
          MUTUALLY_EXCLUSIVE_OPTION,
        ].includes(type) ? (
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
            aria-label="QCode input field"
          />
          {errorMessage && (
            <StyledValidationError>{errorMessage}</StyledValidationError>
          )}
        </SpacedTableColumn>
      )}
      {dataVersion === "3" &&
      [
        CHECKBOX_OPTION,
        RADIO_OPTION,
        SELECT_OPTION,
        MUTUALLY_EXCLUSIVE_OPTION,
      ].includes(type) &&
      !hideOptionValue ? (
        <SpacedTableColumn>
          <ErrorWrappedInput
            name={`${id}-optionValue-entry`}
            data-test={`${id}-value-test-input`}
            value={value}
            onChange={(e) => setValue(e.value)}
            onBlur={() => handleBlurOptionValue(value)}
            hasError={Boolean(valueErrorMessage)}
            aria-label="Option Value input field"
          />
          {valueErrorMessage && (
            <StyledValidationError>{valueErrorMessage}</StyledValidationError>
          )}
        </SpacedTableColumn>
      ) : (
        <EmptyTableColumn />
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
  value: PropTypes.string,
  type: PropTypes.string,
  qCodeCheck: PropTypes.func,
  errorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  valueErrorMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  secondary: PropTypes.bool,
  option: PropTypes.bool,
  listAnswerType: PropTypes.string,
  drivingQCode: PropTypes.string,
  anotherQCode: PropTypes.string,
  hideOptionValue: PropTypes.bool,
};

export const QCodeTable = () => {
  const { questionnaire } = useQuestionnaire();
  const { answerRows, duplicatedQCodes, dataVersion, duplicatedOptionValues } =
    useQCodeContext();
  const getErrorMessage = (qCode) =>
    (!qCode && QCODE_REQUIRED) ||
    (duplicatedQCodes.includes(qCode) && QCODE_IS_NOT_UNIQUE);

  const getValueErrorMessage = (value, idValue) =>
    (!value && VALUE_REQUIRED) ||
    (duplicatedOptionValues.includes(idValue) && VALUE_IS_NOT_UNIQUE);

  let currentQuestionId = "";
  let idValue = "";
  return (
    <Table data-test="qcodes-table">
      <TableHead>
        {dataVersion === "3" ? (
          <TableRow>
            <TableHeadColumn width="10%">Short code</TableHeadColumn>
            <TableHeadColumn width="15%">Question</TableHeadColumn>
            <TableHeadColumn width="20%">Answer Type</TableHeadColumn>
            <TableHeadColumn width="15%">Answer label</TableHeadColumn>
            <TableHeadColumn width="20%">
              Q code for answer type
            </TableHeadColumn>
            <TableHeadColumn width="20%">
              Value for checkbox, radio and select answer labels
            </TableHeadColumn>
          </TableRow>
        ) : (
          <TableRow>
            <TableHeadColumn width="10%">Short code</TableHeadColumn>
            <TableHeadColumn width="20%">Question</TableHeadColumn>
            <TableHeadColumn width="25%">Answer Type</TableHeadColumn>
            <TableHeadColumn width="20%">Answer label</TableHeadColumn>
            <TableHeadColumn width="25%">
              Q code for answer type
            </TableHeadColumn>
          </TableRow>
        )}
      </TableHead>
      <StyledTableBody>
        {answerRows?.map((item, index) => {
          if (
            ![
              CHECKBOX_OPTION,
              RADIO_OPTION,
              SELECT_OPTION,
              MUTUALLY_EXCLUSIVE_OPTION,
            ].includes(item.type)
          ) {
            currentQuestionId = item.id ? item.id : "";
          }
          if ([MUTUALLY_EXCLUSIVE_OPTION].includes(item.type)) {
            const answer = getAnswerByOptionId(questionnaire, item.id);
            const page = getPageByAnswerId(questionnaire, answer.id);
            currentQuestionId = page.answers[0]?.id;
          }
          if (
            item.value &&
            [
              CHECKBOX_OPTION,
              RADIO_OPTION,
              SELECT_OPTION,
              MUTUALLY_EXCLUSIVE_OPTION,
            ].includes(item.type)
          ) {
            idValue = currentQuestionId.concat(item.value);
          }
          if (
            item.additionalAnswer &&
            (dataVersion === "3" || item.type !== "CheckboxOption")
          ) {
            return (
              <React.Fragment key={`${item.id}-${index}`}>
                <Row
                  key={`${item.id}-${index}`}
                  dataVersion={dataVersion}
                  {...item}
                  errorMessage={getErrorMessage(item.qCode)}
                  valueErrorMessage={getValueErrorMessage(item.value, idValue)}
                />
                <Row
                  key={`${item.additionalAnswer.id}-${index}`}
                  dataVersion={dataVersion}
                  {...item.additionalAnswer}
                  errorMessage={getErrorMessage(item.additionalAnswer.qCode)}
                  valueErrorMessage={getValueErrorMessage(item.value, idValue)}
                />
              </React.Fragment>
            );
          } else {
            return (
              <Row
                key={`${item.id}-${index}`}
                dataVersion={dataVersion}
                {...item}
                errorMessage={getErrorMessage(
                  item.qCode ?? item.drivingQCode ?? item.anotherQCode
                )}
                valueErrorMessage={getValueErrorMessage(item.value, idValue)}
              />
            );
          }
        })}
      </StyledTableBody>
    </Table>
  );
};

export default QCodeTable;
