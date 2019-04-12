import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import { propType } from "graphql-anywhere";
import { flow, get } from "lodash/fp";

import Transition from "App/page/Routing/Transition";
import Button from "components/buttons/Button";
import IconText from "components/IconText";
import { colors, radius } from "constants/theme";
import IconRoute from "App/page/Routing/icon-route.svg?inline";
import DestinationSelector from "App/page/Routing/DestinationSelector";
import TextButton from "components/buttons/TextButton";
import { Grid, Column } from "components/Grid";
import { RADIO } from "constants/answer-types";

import BinaryExpressionEditor from "./BinaryExpressionEditor";
import fragment from "./fragment.graphql";
import withDeleteRule from "./withDeleteRule";
import withUpdateRule from "./withUpdateRule";
import withCreateBinaryExpression from "./withCreateBinaryExpression";

const Box = styled.div`
  border: 1px solid ${colors.bordersLight};
  border-radius: ${radius};
  margin-bottom: 2em;
  position: relative;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1em;
`;

export const Title = styled.h2`
  position: absolute;
  margin: 0;
  top: 1.5em;
  left: 1.4em;
  letter-spacing: 0.05em;
  font-size: 0.9em;
  font-weight: bold;
  text-transform: uppercase;
`;

const CenteringColumn = styled(Column)`
  display: flex;
  justify-content: center;
  padding: 0.25em 0;
  margin-bottom: 0.5em;
`;

export class UnwrappedRuleEditor extends React.Component {
  static fragments = [fragment, ...BinaryExpressionEditor.fragments];

  static propTypes = {
    rule: propType(fragment).isRequired,
    title: PropTypes.string,
    deleteRule: PropTypes.func.isRequired,
    updateRule: PropTypes.func.isRequired,
    createBinaryExpression: PropTypes.func.isRequired,
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

  handleCreateExpressionClick = () => {
    this.props.createBinaryExpression(this.props.rule.expressionGroup.id);
  };

  render() {
    const {
      title,
      rule,
      rule: {
        destination,
        expressionGroup: { expressions },
      },
    } = this.props;

    const existingRadioConditions = {};

    return (
      <div data-test="routing-rule">
        <Box>
          {title && <Title>{title}</Title>}
          <Buttons>
            <Button
              onClick={this.handleDeleteClick}
              data-test="btn-delete"
              variant="tertiary"
              small
            >
              <IconText icon={IconRoute}>Remove rule</IconText>
            </Button>
          </Buttons>
          <div>
            <TransitionGroup>
              {expressions.map((expression, index) => {
                const component = (
                  <Transition key={expression.id} exit={false}>
                    <BinaryExpressionEditor
                      expression={expression}
                      label={index > 0 ? "AND" : "IF"}
                      isOnlyExpression={expressions.length === 1}
                      canAddAndCondition={
                        !existingRadioConditions[get("left.id", expression)]
                      }
                    />
                  </Transition>
                );
                if (get("left.type", expression) === RADIO) {
                  existingRadioConditions[get("left.id", expression)] = true;
                }
                return component;
              })}
            </TransitionGroup>
            <Grid align="center">
              <CenteringColumn gutters={false} cols={1}>
                <TextButton
                  onClick={this.handleCreateExpressionClick}
                  data-test="btn-and"
                >
                  AND
                </TextButton>
              </CenteringColumn>
            </Grid>
          </div>
          <DestinationSelector
            id={rule.id}
            label="THEN"
            onChange={this.handleDestinationChange}
            value={destination}
            data-test="select-then"
          />
        </Box>
      </div>
    );
  }
}

const withMutations = flow(
  withDeleteRule,
  withUpdateRule,
  withCreateBinaryExpression
);

export default withMutations(UnwrappedRuleEditor);
