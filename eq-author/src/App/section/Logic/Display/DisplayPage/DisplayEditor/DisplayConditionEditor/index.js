import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import Transition from "components/transitions/BounceTransition";
import Button from "components/buttons/Button";

import { colors } from "constants/theme";
import { RADIO } from "constants/answer-types";

import BinaryExpressionEditor from "App/page/Logic/BinaryExpressionEditor";
import Modal from "components-themed/Modal";

import { Label } from "components/Forms";

import DELETE_ALL_DISPLAY_CONDITIONS_MUTATION from "graphql/deleteAllDisplayConditions.graphql";
import DELETE_DISPLAY_CONDITION_MUTATION from "graphql/deleteDisplayCondition.graphql";

import {
  DELETE_LOGIC_RULE_TITLE,
  DELETE_BUTTON_TEXT,
} from "constants/modal-content";

const LABEL_IF = "IF";
const LABEL_AND = "AND";
const LABEL_OR = "OR";
const LABEL_REMOVE_GROUP = "Remove OR";
const LABEL_REMOVE_ALL_GROUPS = "Remove logic rule";

const Expressions = styled.div`
  background: white;
  padding-top: 1em;
  border-left: 1px solid ${colors.lightMediumGrey};
  border-right: 1px solid ${colors.lightMediumGrey};
`;

export const Title = styled.h2`
  letter-spacing: 0.05em;
  font-size: 0.9em;
  font-weight: bold;
`;

const Header = styled.div`
  background: ${colors.lightMediumGrey};
  padding: 0.5em 1em;
  margin-top: -1px;
  border-top: 3px solid ${colors.primary};
  display: flex;
  align-items: center;
`;

const Middle = styled.div`
  background: ${colors.lightMediumGrey};
  padding: 0.5em 1em;
  margin-top: -1px;
  border-left: 3px solid ${colors.primary};
  display: flex;
  align-items: center;
`;

const RemoveDisplayConditionButton = styled(Button).attrs({
  variant: "tertiary",
  small: true,
})`
  margin-left: auto;
  padding: 0.2em;
`;

const DisplayConditionEditor = ({
  sectionId,
  noun,
  expressionGroup,
  expressionGroupIndex,
  className,
}) => {
  const [deleteOneDisplayCondition] = useMutation(
    DELETE_DISPLAY_CONDITION_MUTATION
  );

  const [deleteAllDisplayConditions] = useMutation(
    DELETE_ALL_DISPLAY_CONDITIONS_MUTATION
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const existingRadioConditions = {};

  const labelGroupTitle = `Display this ${noun}`;

  const header = (
    <Header>
      <Modal
        title={DELETE_LOGIC_RULE_TITLE}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={() =>
          deleteAllDisplayConditions({
            variables: {
              input: {
                sectionId,
              },
            },
          })
        }
        onClose={() => setShowDeleteModal(false)}
      />
      <Label inline>{labelGroupTitle}</Label>
      <RemoveDisplayConditionButton
        onClick={() => setShowDeleteModal(true)}
        data-test="btn-remove-display-conditions"
      >
        {LABEL_REMOVE_ALL_GROUPS}
      </RemoveDisplayConditionButton>
    </Header>
  );

  // TODO: Check the modal title for OR conditions
  const MiddleOr = ({ expressionGroupId }) => (
    <Middle>
      <Modal
        title={DELETE_LOGIC_RULE_TITLE}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={() =>
          deleteOneDisplayCondition({
            variables: {
              input: {
                id: expressionGroupId,
              },
            },
          })
        }
        onClose={() => setShowDeleteModal(false)}
      />
      <Label inline>{LABEL_OR}</Label>
      <RemoveDisplayConditionButton
        onClick={() => setShowDeleteModal(true)}
        data-test="btn-remove-display-condition"
      >
        {LABEL_REMOVE_GROUP}
      </RemoveDisplayConditionButton>
    </Middle>
  );
  return (
    <div data-test="display-condition" className={className}>
      {expressionGroupIndex > 0 ? (
        <MiddleOr expressionGroupId={expressionGroup.id} />
      ) : (
        header
      )}
      <Expressions>
        <TransitionGroup>
          {expressionGroup.expressions.map((expression, index) => {
            const component = (
              <Transition key={expression.id}>
                <BinaryExpressionEditor
                  expression={expression}
                  expressionGroup={expressionGroup}
                  label={index > 0 ? LABEL_AND : LABEL_IF}
                  expressionIndex={index}
                  canAddCondition={
                    !existingRadioConditions[expression?.left?.id]
                  }
                  includeSelf={false}
                />
              </Transition>
            );
            if (expression?.left?.type === RADIO) {
              existingRadioConditions[expression?.left?.id] = true;
            }
            return component;
          })}
        </TransitionGroup>
      </Expressions>
    </div>
  );
};

DisplayConditionEditor.propTypes = {
  sectionId: PropTypes.string.isRequired,
  noun: PropTypes.string,
  expressionGroup: PropTypes.object.isRequired, //eslint-disable-line
  expressionGroupIndex: PropTypes.number.isRequired,
  expressionGroupId: PropTypes.string,
  className: PropTypes.string,
};

DisplayConditionEditor.defaultProps = {
  noun: "section",
};

export default DisplayConditionEditor;
