import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import Transition from "components/transitions/BounceTransition";

import DeleteButton from "components/buttons/DeleteButton";
import Tooltip from "components/Forms/Tooltip";

import { colors } from "constants/theme";
import { RADIO } from "constants/answer-types";
import Modal from "components-themed/Modal";

import { propType } from "graphql-anywhere";
import fragment from "./fragment.graphql";
import BinaryExpressionEditor from "App/page/Logic/BinaryExpressionEditor";

import { Label } from "components/Forms";
import {
  useDeleteSkipConditions,
  useDeleteSkipCondition,
} from "../../../mutations";

import {
  DELETE_LOGIC_RULE_TITLE,
  DELETE_BUTTON_TEXT,
  DELETE_LOGIC_OR_STATEMENT,
} from "constants/modal-content";

export const LABEL_IF = "IF";
export const LABEL_AND = "AND";
export const LABEL_OR = "OR";
export const LABEL_REMOVE_GROUP = "Remove OR";
export const LABEL_REMOVE_ALL_GROUPS = "Remove logic rule";

const Expressions = styled.div`
  background: white;
  padding-top: 1em;
  border-left: 1px solid ${colors.lightMediumGrey};
  border-right: 1px solid ${colors.lightMediumGrey};
`;

const SkipCondition = styled.div``;

export const Title = styled.h2`
  letter-spacing: 0.05em;
  font-size: 0.9em;
  font-weight: bold;
`;

const Header = styled.div`
  background: ${colors.primary};
  border-bottom: 1px solid ${colors.bordersLight};
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const HeaderLabel = styled(Label)`
  color: ${colors.white};
  margin-right: 1em;
`;

const HeaderPanel = styled.span`
  display: flex;
  background: ${colors.darkerBlue};
  color: ${colors.white};
  align-items: center;
  padding: 0.5em 1em;
`;

const Middle = styled.div`
  background: ${colors.lightMediumGrey};
  margin-top: -1px;
  display: flex;
  align-items: center;
`;

const SkipConditionEditor = ({
  pageId,
  noun = "question",
  expressionGroup,
  expressionGroupIndex,
  className,
}) => {
  const deleteSkipConditions = useDeleteSkipConditions({ parentId: pageId });
  const deleteSkipCondition = useDeleteSkipCondition({
    id: expressionGroup.id,
    parentId: pageId,
  });

  const handleDeleteAllClick = deleteSkipConditions;
  const handleDeleteClick = deleteSkipCondition;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const existingRadioConditions = {};

  const labelGroupTitle = `Skip this ${noun}`;

  const header = (
    <Header>
      <Modal
        title={DELETE_LOGIC_RULE_TITLE}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={handleDeleteAllClick}
        onClose={() => setShowDeleteModal(false)}
      />
      <HeaderPanel>
        <HeaderLabel inline>{labelGroupTitle}</HeaderLabel>
        <Tooltip
          content="Delete rule"
          place="top"
          offset={{ top: 0, bottom: 10 }}
        >
          <DeleteButton
            color="white"
            size="medium"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Delete routing rule"
            data-test="btn-delete-routing-rule"
          />
        </Tooltip>
      </HeaderPanel>
    </Header>
  );

  // TODO: Check the modal title for OR conditions
  const middle = (
    <Middle>
      <Modal
        title={DELETE_LOGIC_OR_STATEMENT}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={handleDeleteClick}
        onClose={() => setShowDeleteModal(false)}
      />
      <HeaderPanel>
        <HeaderLabel inline>{LABEL_OR}</HeaderLabel>
        <Tooltip
          content="Delete OR statement"
          place="top"
          offset={{ top: 0, bottom: 10 }}
        >
          <DeleteButton
            color="white"
            size="medium"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Delete or statement"
            data-test="btn-delete-skip-condition-or"
          />
        </Tooltip>
      </HeaderPanel>
    </Middle>
  );

  return (
    <SkipCondition data-test="skip-condition" className={className}>
      {expressionGroupIndex > 0 ? middle : header}
      <Expressions>
        <TransitionGroup>
          {expressionGroup.expressions.map((expression, index) => {
            const component = (
              <Transition key={expression.id}>
                <BinaryExpressionEditor
                  expression={expression}
                  expressionGroup={expressionGroup}
                  conditionType="skip"
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
    </SkipCondition>
  );
};

SkipConditionEditor.propTypes = {
  pageId: PropTypes.string.isRequired,
  noun: PropTypes.string,
  expressionGroup: propType(fragment).isRequired,
  expressionGroupIndex: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default SkipConditionEditor;
