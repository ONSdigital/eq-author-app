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
import Button from "components/buttons/Button";

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

const Transition = styled(BounceTransition)`
  margin-bottom: 2em;
`;

const GroupOperatorValidationError = styled(ValidationError)`
  margin-bottom: 0;
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

const SmallSelect = styled(Select)`
  display: inline-block;
  width: auto;
  margin-bottom: 0;
  line-height: 1.25;
`;

export const GroupOperatorLabel = styled(Label)`
  margin: 0.5em 0 0 0.5em;
`;

const RemoveRuleButton = styled(Button).attrs({
  variant: "tertiary",
  small: true,
})`
  margin-left: auto;
  padding: 0.2em;
`;

const RuleEditorProps = {
  rule: propType(fragment).isRequired,
  ifLabel: PropTypes.string,
  deleteRule: PropTypes.func.isRequired,
  updateRule: PropTypes.func.isRequired,
  updateExpressionGroup: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export const UnwrappedRuleEditor = ({
  rule,
  ifLabel = "If",
  deleteRule,
  updateRule,
  updateExpressionGroup,
  className,
}) => {
  const {
    destination,
    expressionGroup,
    expressionGroup: { expressions },
    validationErrorInfo,
  } = rule;

  const existingRadioConditions = {};

  const handleDeleteClick = () => deleteRule(rule.id);

  const handleDestinationChange = destination =>
    updateRule({...rule, destination});

  const handleGroupOperatorChange = ({value: operator}) =>
        updateExpressionGroup({
          id: expressionGroup.id,
          operator
        });

  const handleExpressionDeletion = expressionGroup => {
    if(expressionGroup?.expressions?.length === 1) {
      updateExpressionGroup({
        id: expressionGroup.id,
        operator: null,
      });
    }
  };

  const validationErrors = validationErrorInfo.totalCount
    ? validationErrorInfo.errors
    : [];

  const groupOperatorError = expressionGroupErrors[
    expressionGroup.validationErrorInfo?.errors?.find(
      ({ field }) => field === "operator"
    )?.errorCode
  ];

  const groupOperatorSelect = (
    <>
      <SmallSelect
        name="match"
        id="match"
        data-test="match-select"
        defaultValue={expressionGroup.operator}
        hasError={groupOperatorError}
        onChange={handleGroupOperatorChange}
      >
        <option value={null} selected disabled hidden> Select AND/OR </option>
        <option value="Or">OR</option>
        <option value="And">AND</option>
      </SmallSelect>
      { groupOperatorError &&
        <GroupOperatorValidationError right={false}>
          { groupOperatorError }
        </GroupOperatorValidationError>
      }
    </>
  );

  return (
    <Rule data-test="routing-rule" className={className}>
      <Header>
        <Label inline> Routing logic rules </Label>
        <RemoveRuleButton
          onClick={handleDeleteClick}
          data-test="btn-remove-rule"
        >
          Remove rule
        </RemoveRuleButton>
      </Header>
      <Expressions>
        <TransitionGroup>
          {expressions.map((expression, index) => {
            let groupOperatorComponent = null;
            if(expressions.length > 1) {
              if(index === 0) {
                groupOperatorComponent = groupOperatorSelect;
              }
              else if (index < expressions.length - 1) {
                groupOperatorComponent = <GroupOperatorLabel inline>
                                           { expressionGroup.operator?.toUpperCase() }
                                         </GroupOperatorLabel>;
              }
            }

            const component = (
              <Transition key={expression.id} exit={false}>
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
              </Transition>
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
        validationErrors={validationErrors}
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
