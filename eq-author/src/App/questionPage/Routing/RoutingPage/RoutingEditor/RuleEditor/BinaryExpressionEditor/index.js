import React from "react";
import { PropTypes } from "prop-types";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";
import { get, isNil, uniqueId, flow } from "lodash/fp";
import { propType } from "graphql-anywhere";
import { NavLink, withRouter } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";
import { RADIO, NUMBER, CURRENCY, PERCENTAGE } from "constants/answer-types";
import {
  NO_ROUTABLE_ANSWER_ON_PAGE,
  SELECTED_ANSWER_DELETED,
} from "constants/routing-left-side";
import DeleteButton from "components/buttons/DeleteButton";
import IconText from "components/IconText";
import { Grid, Column } from "components/Grid";
import { buildPagePath } from "utils/UrlUtils";

import Transition from "../../../../Transition";

import RoutingAnswerContentPicker from "./RoutingAnswerContentPicker";
import svgPath from "./path.svg";
import svgPathEnd from "./path-end.svg";
import IconClose from "./icon-close.svg?inline";
import { Alert, AlertText, AlertTitle } from "./Alert";
import fragment from "./fragment.graphql";
import withUpdateLeftSide from "./withUpdateLeftSide";
import withDeleteBinaryExpression from "./withDeleteBinaryExpression";
import withUpdateRightSide from "./withUpdateRightSide";
import withUpdateBinaryExpression from "./withUpdateBinaryExpression";
import MultipleChoiceAnswerOptionsSelector from "./MultipleChoiceAnswerOptionsSelector";
import NumberAnswerSelector from "./NumberAnswerSelector";

const Label = styled.label`
  width: 100%;
  display: inline-block;
  font-size: 0.9em;
  letter-spacing: 0.05em;
  font-weight: bold;
  text-align: center;
  align-self: center;
`;

const ConnectedPath = styled.div`
  position: relative;
  height: 100%;

  &::after {
    position: absolute;
    content: "";
    background: url(${({ pathEnd }) => (pathEnd ? svgPathEnd : svgPath)})
      no-repeat center center;
    background-size: auto;
    width: 100%;
    height: calc(100% - 2em);
    top: 0;
    bottom: 0;
    margin: auto;
  }
`;

const RemoveButton = styled(DeleteButton)`
  display: block;
  margin: auto;
  position: relative;
  right: 2px;
`;

/* eslint-disable react/prop-types */
const ERROR_SITUATIONS = [
  {
    condition: props =>
      props.expression.left.reason === SELECTED_ANSWER_DELETED,
    message: () => (
      <Alert data-test="deleted-answer-msg">
        <AlertTitle>
          The question this condition referred to has been deleted
        </AlertTitle>
        <AlertText>
          Please select a new question from the dropdown above.
        </AlertText>
      </Alert>
    ),
  },
  {
    condition: props =>
      props.expression.left.reason === NO_ROUTABLE_ANSWER_ON_PAGE,
    message: props => (
      <Alert data-test="no-answer-msg">
        <AlertTitle>
          No routable answers have been added to this question yet.
        </AlertTitle>
        <AlertText>
          First,{" "}
          <NavLink to={buildPagePath(props.match.params)}>
            add an answer
          </NavLink>{" "}
          to continue.
        </AlertText>
      </Alert>
    ),
  },
  {
    condition: props => !props.canAddAndCondition,
    message: () => (
      <Alert data-test="and-not-valid-msg">
        <AlertTitle>
          AND condition not valid with &lsquo;radio button&rsquo; answer
        </AlertTitle>
        <AlertText>Please select a different question.</AlertText>
      </Alert>
    ),
  },
];
/* eslint-enable react/prop-types */

const ANSWER_TYPE_TO_RIGHT_EDITOR = {
  [RADIO]: MultipleChoiceAnswerOptionsSelector,
  [NUMBER]: NumberAnswerSelector,
  [PERCENTAGE]: NumberAnswerSelector,
  [CURRENCY]: NumberAnswerSelector,
};

export class UnwrappedBinaryExpressionEditor extends React.Component {
  static fragments = [fragment];

  static propTypes = {
    expression: propType(fragment).isRequired,
    label: PropTypes.string.isRequired,
    isOnlyExpression: PropTypes.bool.isRequired,
    updateLeftSide: PropTypes.func.isRequired,
    deleteBinaryExpression: PropTypes.func.isRequired,
    canAddAndCondition: PropTypes.bool.isRequired,
    updateRightSide: PropTypes.func.isRequired,
    updateBinaryExpression: PropTypes.func.isRequired,
    match: CustomPropTypes.match,
  };

  id = uniqueId("RoutingCondition");

  static defaultProps = {
    label: "IF",
  };

  handleLeftSideChange = contentPickerResult => {
    this.props.updateLeftSide(
      this.props.expression,
      contentPickerResult.value.id
    );
  };

  handleDeleteClick = () => {
    this.props.deleteBinaryExpression(this.props.expression.id);
  };

  handleUpdateRightSide = updateField => {
    this.props.updateRightSide(this.props.expression, updateField);
  };

  handleUpdateCondition = condition => {
    this.props.updateBinaryExpression(this.props.expression, condition);
  };

  renderEditor() {
    for (let i = 0; i < ERROR_SITUATIONS.length; ++i) {
      const { condition, message } = ERROR_SITUATIONS[i];
      if (condition(this.props)) {
        return message(this.props);
      }
    }

    const type = get("left.type", this.props.expression);
    const Editor = ANSWER_TYPE_TO_RIGHT_EDITOR[type];
    return (
      <Editor
        expression={this.props.expression}
        onRightChange={this.handleUpdateRightSide}
        onConditionChange={this.handleUpdateCondition}
      />
    );
  }

  render() {
    const routingEditor = this.renderEditor();

    return (
      <div data-test="routing-binary-expression">
        <Grid align="center">
          <Column gutters={false} cols={1}>
            <Label htmlFor={this.id}>{this.props.label}</Label>
          </Column>
          <Column gutters={false} cols={10}>
            <RoutingAnswerContentPicker
              id={this.id}
              path="questionPage.availableRoutingAnswers"
              selectedContentDisplayName={get(
                "left.displayName",
                this.props.expression
              )}
              onSubmit={this.handleLeftSideChange}
              selectedId={get("left.id", this.props.expression)}
            />
          </Column>
          <Column gutters={false} cols={1}>
            <RemoveButton
              onClick={this.handleDeleteClick}
              disabled={this.props.isOnlyExpression}
              data-test="btn-remove"
            >
              <IconText icon={IconClose} hideText>
                Remove
              </IconText>
            </RemoveButton>
          </Column>
        </Grid>
        <Grid>
          <Column gutters={false} cols={1}>
            <ConnectedPath pathEnd={isNil(this.props.expression.left)} />
          </Column>
          <Column gutters={false} cols={10}>
            <TransitionGroup>
              <Transition key="answer" exit={false}>
                {routingEditor}
              </Transition>
            </TransitionGroup>
          </Column>
          <Column cols={1} />
        </Grid>
      </div>
    );
  }
}

const withMutations = flow(
  withRouter,
  withUpdateLeftSide,
  withDeleteBinaryExpression,
  withUpdateRightSide,
  withUpdateBinaryExpression
);

export default withMutations(UnwrappedBinaryExpressionEditor);
