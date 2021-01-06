import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import { propType } from "graphql-anywhere";
import { flow, get, find } from "lodash/fp";

import Transition from "App/page/Logic/Routing/Transition";
import Button from "components/buttons/Button";

import { colors } from "constants/theme";

import DestinationSelector from "App/page/Logic/Routing/DestinationSelector";

import { RADIO } from "constants/answer-types";

import BinaryExpressionEditor from "App/page/Logic/BinaryExpressionEditor";
import fragment from "./fragment.graphql";
import withDeleteRule from "./withDeleteRule";
import withUpdateRule from "./withUpdateRule";
import withUpdateExpressionGroup from "./withUpdateExpressionGroup";

import { Select, Label } from "components/Forms";

import ValidationError from "components/ValidationError";
import { destinationErrors } from "constants/validationMessages";

const RepositionedValidationError = styled(ValidationError)`
  padding-left: 41%;
  justify-content: unset;
  margin-top: 0;
`;

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

export class UnwrappedRuleEditor extends React.Component {
  static fragments = [fragment, ...BinaryExpressionEditor.fragments];

  static propTypes = {
    rule: propType(fragment).isRequired,
    ifLabel: PropTypes.string,
    deleteRule: PropTypes.func.isRequired,
    updateRule: PropTypes.func.isRequired,
    updateExpressionGroup: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    ifLabel: "If",
  };

  handleDeleteClick = () => {
    this.props.deleteRule(this.props.rule.id);
  };

  handleDestinationChange = destination => {
    this.props.updateRule({
      ...this.props.rule,
      destination,
    });
  };

  render() {
    const {
      className,
      ifLabel,
      rule,
      rule: {
        destination,
        expressionGroup: { expressions },
      },
    } = this.props;

    const existingRadioConditions = {};

    const validationErrorInfo = rule.validationErrorInfo;

    const validationErrors = validationErrorInfo.totalCount
      ? validationErrorInfo.errors
      : [];

    const matchSelectErrors = expressions.filter(({ validationErrorInfo }) => {
      if (!validationErrorInfo || !validationErrorInfo.totalCount) {
        return false;
      }
      const expressionGroupOperatorErrors = validationErrorInfo.errors.filter(
        ({ field }) => field === "groupOperator"
      );

      if (expressionGroupOperatorErrors.length) {
        return true;
      }

      return false;
    }).length;

    const hasDestinationErr = find(
      err => err.field === "destination",
      validationErrors
    );

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
                defaultValue={rule.expressionGroup.operator}
                hasError={matchSelectErrors}
                onChange={({ value }) => {
                  this.props.updateExpressionGroup({
                    id: rule.expressionGroup.id,
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
              onClick={this.handleDeleteClick}
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
                      operator={rule.expressionGroup.operator}
                      expression={expression}
                      expressionGroupId={rule.expressionGroup.id}
                      label={
                        index > 0 ? rule.expressionGroup.operator : ifLabel
                      }
                      isOnlyExpression={expressions.length === 1}
                      isLastExpression={index === expressions.length - 1}
                      canAddCondition={
                        !existingRadioConditions[get("left.id", expression)]
                      }
                      includeSelf
                    />
                  </Transition>
                );
                if (get("left.type", expression) === RADIO) {
                  existingRadioConditions[get("left.id", expression)] = true;
                }
                return component;
              })}
            </TransitionGroup>
          </Expressions>

          <DestinationSelector
            id={rule.id}
            label={LABEL_THEN}
            onChange={this.handleDestinationChange}
            value={destination}
            data-test="select-then"
            validationErrors={validationErrors}
          />
        </Rule>
        {hasDestinationErr && (
          <RepositionedValidationError
            test="destination-validation-error"
            right
          >
            <p>{destinationErrors[hasDestinationErr.errorCode].message}</p>
          </RepositionedValidationError>
        )}
      </>
    );
  }
}

const withMutations = flow(
  withDeleteRule,
  withUpdateRule,
  withUpdateExpressionGroup
);

export default withMutations(UnwrappedRuleEditor);
