import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import Transition from "components/transitions/BounceTransition";
import Button from "components/buttons/Button";
import DeleteButton from "components/buttons/DeleteButton";

import { colors } from "constants/theme";
import { RADIO } from "constants/answer-types";

import { propType } from "graphql-anywhere";
import fragment from "./fragment.graphql";
import BinaryExpressionEditor from "App/page/Logic/BinaryExpressionEditor";

import { Label } from "components/Forms";
import {
  useDeleteSkipConditions,
  useDeleteSkipCondition,
} from "../../../mutations";

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

const OrConditionHeader = styled.div`
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

const RemoveSkipConditionButton = styled(Button).attrs({
  variant: "tertiary",
  small: true,
})`
  margin-left: auto;
  padding: 0.2em;
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

  const existingRadioConditions = {};

  const labelGroupTitle = `Skip this ${noun}`;

  const header = (
    <Header>
      <HeaderPanel>
        <HeaderLabel inline>{labelGroupTitle}</HeaderLabel>
        <DeleteButton
          color="white"
          size="medium"
          onClick={handleDeleteAllClick}
          aria-label="Delete routing rule"
          data-test="btn-delete-routing-rule"
        />
      </HeaderPanel>
    </Header>
  );

  const middle = (
    <Middle>
      <Label inline>{LABEL_OR}</Label>
      <RemoveSkipConditionButton
        onClick={handleDeleteClick}
        data-test="btn-remove-skip-condition"
      >
        {LABEL_REMOVE_GROUP}
      </RemoveSkipConditionButton>
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
