import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import { propType } from "graphql-anywhere";
import { flow } from "lodash/fp";

import BounceTransition from "components/transitions/BounceTransition";
import DestinationSelector from "App/page/Logic/Routing/DestinationSelector";
import BinaryExpressionEditor from "App/page/Logic/BinaryExpressionEditor";

import fragment from "./fragment.graphql";
import withDeleteRule from "./withDeleteRule";
import withUpdateRule from "./withUpdateRule";
import withUpdateExpressionGroup from "./withUpdateExpressionGroup";

import { Select, Label } from "components/Forms";
import Tooltip from "components/Forms/Tooltip";
import DeleteButton from "components/buttons/DeleteButton";
import MoveButton, { IconUp, IconDown } from "components/buttons/MoveButton";

import { colors } from "constants/theme";
import { RADIO } from "constants/answer-types";

import { expressionGroupErrors } from "constants/validationMessages";
import ValidationError from "components/ValidationError";

const LABEL_THEN = "Then";

const Expressions = styled.div`
  background: white;
  padding-top: 1em;
  border-left: 1px solid ${colors.lightMediumGrey};
  border-right: 1px solid ${colors.lightMediumGrey};
`;

const Rule = styled.div`
  margin-bottom: 2em;
`;

const GroupOperatorWrapper = styled.div`
  margin-bottom: 2em;
`;

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

const SmallSelect = styled(Select)`
  display: block;
  width: 14.2em;
  margin-bottom: 0;
  line-height: 1.25;
`;

export const GroupOperatorLabel = styled(Label)`
  margin: 0.5em 0 2em 0.5em;
`;

const RuleEditorProps = {
  rule: propType(fragment).isRequired,
  ifLabel: PropTypes.string,
  deleteRule: PropTypes.func.isRequired,
  updateRule: PropTypes.func.isRequired,
  updateExpressionGroup: PropTypes.func.isRequired,
  // onMove and canMove props are passed from the Reorder component in RoutingEditor
  onMoveUp: PropTypes.func.isRequired,
  canMoveUp: PropTypes.bool.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  canMoveDown: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export const UnwrappedRuleEditor = ({
  rule,
  ifLabel = "If",
  deleteRule,
  updateRule,
  updateExpressionGroup,
  className,
  ...props
}) => {
  const {
    destination,
    expressionGroup,
    expressionGroup: { expressions },
  } = rule;

  const existingRadioConditions = {};

  const handleDeleteClick = () => deleteRule(rule.id);

  const handleDestinationChange = (destination) =>
    updateRule({ ...rule, destination });

  const handleGroupOperatorChange = ({ value: operator }) =>
    updateExpressionGroup({
      id: expressionGroup.id,
      operator,
    });

  const handleExpressionDeletion = (expressionGroup) => {
    if (expressionGroup?.expressions?.length === 1) {
      updateExpressionGroup({
        id: expressionGroup.id,
        operator: null,
      });
    }
  };

  const groupOperatorError =
    expressionGroupErrors[
      expressionGroup.validationErrorInfo?.errors?.find(
        ({ field }) => field === "operator"
      )?.errorCode
    ];

  const groupOperatorSelect = (
    <GroupOperatorWrapper>
      <SmallSelect
        name="match"
        id="match"
        data-test="match-select"
        defaultValue={expressionGroup.operator}
        hasError={groupOperatorError}
        onChange={handleGroupOperatorChange}
      >
        {groupOperatorError && (
          <option value={null}> Select OR/AND condition</option>
        )}
        <option value="Or">OR</option>
        <option value="And">AND</option>
      </SmallSelect>
      {groupOperatorError && (
        <ValidationError>{groupOperatorError}</ValidationError>
      )}
    </GroupOperatorWrapper>
  );

  return (
    <Rule data-test="routing-rule" className={className}>
      <Header>
        <HeaderPanel>
          <HeaderLabel inline> Routing logic rule </HeaderLabel>
          <Tooltip
            content="Move rule up"
            place="top"
            offset={{ top: 0, bottom: 10 }}
          >
            <MoveButton
              color="white"
              disabled={!props.canMoveUp}
              tabIndex={!props.canMoveUp ? -1 : undefined}
              aria-label={"Move rule up"}
              onClick={props.onMoveUp}
              data-test="btn-move-routing-rule-up"
            >
              <IconUp />
            </MoveButton>
          </Tooltip>
          <Tooltip
            content="Move rule down"
            place="top"
            offset={{ top: 0, bottom: 10 }}
          >
            <MoveButton
              color="white"
              disabled={!props.canMoveDown}
              tabIndex={!props.canMoveDown ? -1 : undefined}
              aria-label={"Move rule down"}
              onClick={props.onMoveDown}
              data-test="btn-move-routing-rule-down"
            >
              <IconDown />
            </MoveButton>
          </Tooltip>
          <Tooltip
            content="Delete rule"
            place="top"
            offset={{ top: 0, bottom: 10 }}
          >
            <DeleteButton
              color="white"
              size="medium"
              onClick={handleDeleteClick}
              aria-label="Delete routing rule"
              data-test="btn-delete-routing-rule"
            />
          </Tooltip>
        </HeaderPanel>
      </Header>
      <Expressions>
        <TransitionGroup>
          {expressions.map((expression, index) => {
            let groupOperatorComponent = null;
            if (expressions.length > 1) {
              if (index === 0) {
                groupOperatorComponent = groupOperatorSelect;
              } else if (index < expressions.length - 1) {
                groupOperatorComponent = (
                  <GroupOperatorLabel inline>
                    {expressionGroup.operator?.toUpperCase()}
                  </GroupOperatorLabel>
                );
              }
            }

            const component = (
              <BounceTransition key={expression.id} exit={false}>
                <BinaryExpressionEditor
                  expression={expression}
                  expressionGroup={expressionGroup}
                  expressionGroupId={expressionGroup.id}
                  label={index > 0 ? "IF" : ifLabel}
                  expressionIndex={index}
                  canAddCondition={
                    !existingRadioConditions[expression.left?.id]
                  }
                  groupOperatorComponent={groupOperatorComponent}
                  includeSelf
                  onExpressionDeleted={handleExpressionDeletion}
                />
              </BounceTransition>
            );
            if (expression.left?.type === RADIO) {
              existingRadioConditions[expression.left?.id] = true;
            }
            return component;
          })}
        </TransitionGroup>
      </Expressions>
      <DestinationSelector
        id={rule.id}
        label={LABEL_THEN}
        onChange={handleDestinationChange}
        value={destination}
        data-test="select-then"
      />
    </Rule>
  );
};

UnwrappedRuleEditor.propTypes = RuleEditorProps;

UnwrappedRuleEditor.fragments = [fragment, ...BinaryExpressionEditor.fragments];

const withMutations = flow(
  withDeleteRule,
  withUpdateRule,
  withUpdateExpressionGroup
);

export default withMutations(UnwrappedRuleEditor);
