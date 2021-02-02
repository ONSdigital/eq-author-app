import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import { propType } from "graphql-anywhere";
import { flow } from "lodash/fp";

import Transition from "App/page/Logic/Routing/Transition";
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

const LABEL_THEN = "Then";

const Expressions = styled.div`
  background: white;
  padding-top: 1em;
  border-left: 1px solid ${colors.lightMediumGrey};
  border-right: 1px solid ${colors.lightMediumGrey};
`;

const Rule = styled.div`
  &:not(:first-of-type) {
    margin-top: 2em;
  }
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
  margin: 0 0.5em;
  line-height: 1.25;
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

  const handleDeleteClick = () => {
    deleteRule(rule.id);
  };

  const handleDestinationChange = destination => {
    updateRule({
      ...rule,
      destination,
    });
  };

  const validationErrors = validationErrorInfo.totalCount
    ? validationErrorInfo.errors
    : [];

  const matchSelectErrors = expressions.filter(expression => {
    const { totalCount, errors } = expression.validationErrorInfo;

    if (!expression.validationErrorInfo || !totalCount) {
      return false;
    }

    const expressionGroupOperatorErrors = errors.filter(
      ({ field }) => field === "groupOperator"
    );

    return expressionGroupOperatorErrors.length > 0;
  }).length;

  return (
    <>
      <Rule data-test="routing-rule" className={className}>
        <Header>
          <Label inline>
            Match
            <SmallSelect
              name="match"
              id="match"
              data-test="match-select"
              defaultValue={expressionGroup.operator}
              hasError={matchSelectErrors}
              onChange={({ value }) => {
                updateExpressionGroup({
                  id: expressionGroup.id,
                  operator: value,
                });
              }}
            >
              <option value="Or">Any of</option>
              <option value="And">All of</option>
            </SmallSelect>
            the following rules
          </Label>

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
              const component = (
                <Transition key={expression.id}>
                  <BinaryExpressionEditor
                    expression={expression}
                    expressionGroup={expressionGroup}
                    expressionGroupId={expressionGroup.id}
                    label={index > 0 ? expressionGroup.operator : ifLabel}
                    expressionIndex={index}
                    canAddCondition={
                      !existingRadioConditions[expression.left?.id]
                    }
                    includeSelf
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
    </>
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
