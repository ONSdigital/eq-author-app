import React, { useState } from "react";
import { PropTypes } from "prop-types";
import { flow, some } from "lodash/fp";
import { propType } from "graphql-anywhere";
import Tooltip from "components/Forms/Tooltip";
import { useMutation } from "@apollo/react-hooks";

import {
  RADIO,
  NUMBER,
  CURRENCY,
  PERCENTAGE,
  UNIT,
  CHECKBOX,
  DATE,
  SELECT,
  MUTUALLY_EXCLUSIVE,
} from "constants/answer-types";

import { TEXT, TEXT_OPTIONAL } from "constants/metadata-types";

import {
  NO_ROUTABLE_ANSWER_ON_PAGE,
  SELECTED_ANSWER_DELETED,
} from "constants/routing-left-side";

import {
  binaryExpressionErrors,
  leftSideErrors,
} from "constants/validationMessages";

import IconText from "components/IconText";
import { Grid, Column } from "components/Grid";

import Transition from "components/transitions/BounceTransition";

import ContentPicker from "./RoutingAnswerContentPicker";
import ValidationError from "components/ValidationError";
import IconMinus from "./icon-minus.svg?inline";
import IconPlus from "./icon-plus.svg?inline";
import WarningIcon from "constants/icon-warning.svg?inline";
import Modal from "components-themed/Modal";
import MetadataTextSelector from "./MetadataTextSelector";

import fragment from "./fragment.graphql";
import withUpdateLeftSide from "./withUpdateLeftSide";
import withDeleteBinaryExpression from "./withDeleteBinaryExpression";
import withCreateBinaryExpression from "./withCreateBinaryExpression";
import withUpdateRightSide from "./withUpdateRightSide";
import withUpdateBinaryExpression from "./withUpdateBinaryExpression";
import MultipleChoiceAnswerOptionsSelector from "./MultipleChoiceAnswerOptionsSelector";
import NumberAnswerSelector from "./NumberAnswerSelector";
import DateAnswerSelector from "./DateAnswerSelector";

import DELETE_SKIP_CONDITION from "../../../shared/Logic/SkipLogic/deleteSkipCondition.graphql";

import {
  ActionButtons,
  RemoveButton,
  AddButton,
  StyledLabel,
  ConnectedPath,
} from "./components";

import {
  DELETE_LOGIC_CONDITION_TITLE,
  DELETE_BUTTON_TEXT,
} from "constants/modal-content";

const ANSWER_PICKER_ERROR_SITUATIONS = [
  {
    condition: ({ expression }) =>
      expression.left.reason === SELECTED_ANSWER_DELETED,
    message: binaryExpressionErrors.ANSWER_DELETED,
  },
  {
    condition: ({ expression }) =>
      expression.left.reason === NO_ROUTABLE_ANSWER_ON_PAGE,
    message: binaryExpressionErrors.NO_ROUTABLE_ANSWERS_AVAILABLE,
  },
  {
    condition: ({ canAddCondition, expressionGroup }) =>
      !canAddCondition && expressionGroup.operator === "Or",
    message: binaryExpressionErrors.NO_OR_ON_MULTIPLE_RADIO,
  },
  {
    condition: ({ canAddCondition }) => !canAddCondition,
    message: binaryExpressionErrors.AND_NOT_VALID_WITH_RADIO,
  },
  {
    condition: ({ expression }) =>
      some(
        { errorCode: binaryExpressionErrors.ERR_ANSWER_NOT_SELECTED.errorCode },
        expression.validationErrorInfo.errors
      ),
    message: binaryExpressionErrors.ERR_ANSWER_NOT_SELECTED.message,
  },
  {
    condition: ({ expression }) =>
      some(
        {
          errorCode: leftSideErrors.ERR_LEFTSIDE_NO_LONGER_AVAILABLE.errorCode,
        },
        expression.validationErrorInfo.errors
      ),
    message: leftSideErrors.ERR_LEFTSIDE_NO_LONGER_AVAILABLE.message,
  },
];

const ANSWER_TYPE_TO_RIGHT_EDITOR = {
  [RADIO]: MultipleChoiceAnswerOptionsSelector,
  [SELECT]: MultipleChoiceAnswerOptionsSelector,
  [CHECKBOX]: MultipleChoiceAnswerOptionsSelector,
  [MUTUALLY_EXCLUSIVE]: MultipleChoiceAnswerOptionsSelector,
  [NUMBER]: NumberAnswerSelector,
  [PERCENTAGE]: NumberAnswerSelector,
  [CURRENCY]: NumberAnswerSelector,
  [UNIT]: NumberAnswerSelector,
  [DATE]: DateAnswerSelector,
};

const METADATA_TYPE_TO_RIGHT_EDITOR = {
  [TEXT.value]: MetadataTextSelector,
  [TEXT_OPTIONAL.value]: MetadataTextSelector,
};

export const UnwrappedBinaryExpressionEditor = ({
  expression,
  expressionIndex,
  expressionGroup,
  conditionType,
  label = "If",
  updateLeftSide,
  updateRightSide,
  createBinaryExpression,
  updateBinaryExpression,
  deleteBinaryExpression,
  canAddCondition,
  includeSelf,
  groupOperatorComponent,
  onExpressionDeleted = () => null,
}) => {
  const { expressions } = expressionGroup;
  const [deleteSkipCondition] = useMutation(DELETE_SKIP_CONDITION);

  const handleLeftSideChange = (contentPickerResult) => {
    expression.left.id !== contentPickerResult.value.id &&
      updateLeftSide(
        expression,
        contentPickerResult.value.id,
        contentPickerResult.name
      );
  };

  const handleDeleteClick = () => {
    if (expressions.length === 1 && conditionType === "skip") {
      deleteSkipCondition({
        variables: {
          input: { id: expressionGroup.id },
        },
      });
    } else {
      deleteBinaryExpression(expression.id, onExpressionDeleted);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddClick = () => createBinaryExpression(expressionGroup.id);

  const handleUpdateRightSide = (updateField) =>
    updateRightSide(expression, updateField);

  const handleUpdateCondition = (condition, secondaryCondition) => {
    updateBinaryExpression(expression, condition, secondaryCondition);
  };

  const answerPickerError = ANSWER_PICKER_ERROR_SITUATIONS.find(
    ({ condition }) =>
      condition({ expression, canAddCondition, expressionGroup })
  )?.message;

  const groupErrorMessage =
    binaryExpressionErrors[
      expression?.expressionGroup?.validationErrorInfo?.errors?.filter(
        ({ field }) => expression?.left?.id === field
      )?.[0]?.errorCode
    ];

  const AnswerEditor = ANSWER_TYPE_TO_RIGHT_EDITOR[expression?.left?.type];
  const MetadataEditor =
    METADATA_TYPE_TO_RIGHT_EDITOR[expression?.left?.metadataType];

  const shouldRenderEditor =
    (AnswerEditor && !expression.left.reason && !answerPickerError) ||
    MetadataEditor;

  const isLastExpression =
    expressionIndex === expressionGroup.expressions.length - 1;

  return (
    <>
      <Grid align="center">
        <Column gutters={false} cols={1.5}>
          <StyledLabel data-test="routing-binary-expression-if-label" inline>
            {label}
          </StyledLabel>
        </Column>
        <Column gutters={false} cols={8}>
          <ContentPicker
            selectedContentDisplayName={
              expression?.left.hasOwnProperty("displayName")
                ? expression.left
                : undefined
            }
            expressionGroup={expressionGroup}
            onSubmit={handleLeftSideChange}
            selectedId={expression?.left?.id}
            data-test="routing-answer-picker"
            includeSelf={includeSelf}
            hasError={Boolean(answerPickerError)}
          />
        </Column>
        <Column gutters={false} cols={2.5}>
          <Modal
            title={DELETE_LOGIC_CONDITION_TITLE}
            positiveButtonText={DELETE_BUTTON_TEXT}
            isOpen={showDeleteModal}
            onConfirm={handleDeleteClick}
            onClose={() => setShowDeleteModal(false)}
          />
          <ActionButtons data-test="action-btns" horizontal>
            <Tooltip content="Remove condition" place="top">
              <RemoveButton
                onClick={() => setShowDeleteModal(true)}
                disabled={
                  conditionType !== "skip" &&
                  expressionGroup.expressions.length === 1
                }
                data-test="btn-remove"
                small
              >
                <IconText icon={IconMinus} hideText>
                  Remove condition
                </IconText>
              </RemoveButton>
            </Tooltip>
            <Tooltip content="Add condition" place="top">
              <AddButton
                small
                onClick={handleAddClick}
                data-test="btn-add"
                disabled={
                  !shouldRenderEditor ||
                  (expressionGroup?.expressions?.length > 1 &&
                    !expressionGroup?.operator)
                }
              >
                <IconText icon={IconPlus} hideText>
                  Add condition
                </IconText>
              </AddButton>
            </Tooltip>
          </ActionButtons>
        </Column>
      </Grid>
      {answerPickerError && (
        <ValidationError icon={WarningIcon} variant="logic">
          {answerPickerError}
        </ValidationError>
      )}
      <Grid>
        <Column gutters={false} cols={1.5}>
          <ConnectedPath pathEnd={isLastExpression || groupOperatorComponent} />
        </Column>
        <Column gutters={false} cols={8}>
          <Transition
            in={shouldRenderEditor}
            mountOnEnter
            unmountOnExit
            timeout={400}
          >
            {AnswerEditor && (
              <AnswerEditor
                expression={expression}
                onRightChange={handleUpdateRightSide}
                onConditionChange={handleUpdateCondition}
                groupErrorMessage={groupErrorMessage}
              />
            )}
            {MetadataEditor && <MetadataEditor expression={expression} />}
          </Transition>
        </Column>
        <Column cols={2.5} />
      </Grid>
      <Grid>
        <Column cols={1.5} />
        <Column cols={8}>{groupOperatorComponent}</Column>
        <Column cols={2.5} />
      </Grid>
    </>
  );
};

UnwrappedBinaryExpressionEditor.fragments = [fragment];

const expressionPropType = propType(fragment);

UnwrappedBinaryExpressionEditor.propTypes = {
  expression: propType(fragment).isRequired,
  label: PropTypes.string,
  conditionType: PropTypes.string,
  expressionIndex: PropTypes.number.isRequired,
  updateLeftSide: PropTypes.func.isRequired,
  deleteBinaryExpression: PropTypes.func.isRequired,
  createBinaryExpression: PropTypes.func.isRequired,
  canAddCondition: PropTypes.bool.isRequired,
  updateRightSide: PropTypes.func.isRequired,
  updateBinaryExpression: PropTypes.func.isRequired,
  includeSelf: PropTypes.bool,
  expressionGroup: PropTypes.shape({
    expression: PropTypes.arrayOf(expressionPropType),
  }),
  groupOperatorComponent: PropTypes.node,
  onExpressionDeleted: PropTypes.func,
};

const withMutations = flow(
  withUpdateLeftSide,
  withDeleteBinaryExpression,
  withCreateBinaryExpression,
  withUpdateRightSide,
  withUpdateBinaryExpression
);

export default withMutations(UnwrappedBinaryExpressionEditor);
