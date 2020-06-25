import React from "react";
import { PropTypes } from "prop-types";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";
import { get, uniqueId, flow } from "lodash/fp";
import { propType } from "graphql-anywhere";
import { NavLink, withRouter } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";
import {
  RADIO,
  NUMBER,
  CURRENCY,
  PERCENTAGE,
  UNIT,
  CHECKBOX,
} from "constants/answer-types";
import {
  NO_ROUTABLE_ANSWER_ON_PAGE,
  SELECTED_ANSWER_DELETED,
  DEFAULT_ROUTING,
  DEFAULT_SKIP_CONDITION,
} from "constants/routing-left-side";

import IconText from "components/IconText";
import { Grid, Column } from "components/Grid";
import { buildPagePath } from "utils/UrlUtils";

import Transition from "App/page/Logic/Routing/Transition";

import RoutingAnswerContentPicker from "./RoutingAnswerContentPicker";
import svgPath from "./path.svg";
import svgPathEnd from "./path-end.svg";
import IconMinus from "./icon-minus.svg?inline";
import IconPlus from "./icon-plus.svg?inline";
import { Alert, AlertText, AlertTitle } from "./Alert";
import fragment from "./fragment.graphql";
import withUpdateLeftSide from "./withUpdateLeftSide";
import withDeleteBinaryExpression from "./withDeleteBinaryExpression";
import withCreateBinaryExpression from "./withCreateBinaryExpression";
import withUpdateRightSide from "./withUpdateRightSide";
import withUpdateBinaryExpression from "./withUpdateBinaryExpression";
import MultipleChoiceAnswerOptionsSelector from "./MultipleChoiceAnswerOptionsSelector";
import NumberAnswerSelector from "./NumberAnswerSelector";
import { colors } from "constants/theme";

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

const ActionButtons = styled.div`
  margin: auto;
  align-items: center;
  justify-content: center;
  display: ${props => (props.isHidden ? "none" : "flex")};
`;

const ActionButton = styled.button`
  --color-text: white;

  appearance: none;
  border: none;
  width: 18px;
  height: 18px;
  background: ${colors.primary};
  border-radius: 100px;
  position: relative;
  right: 2px;
  margin: 0.25em;
  cursor: pointer;
  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary};
    outline: none;
  }
  svg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &[disabled] {
    opacity: 0.3;
    pointer-events: none;
  }
`;

const RemoveButton = styled(ActionButton)`
  &:hover {
    background: ${colors.red};
  }
`;

const AddButton = styled(ActionButton)`
  &:hover {
    background: ${colors.green};
  }
`;

const Flex = styled.div`
  display: flex;
`;

const ContentPicker = styled(RoutingAnswerContentPicker)`
  flex: 1 1 auto;
`;

const DefaultRouteDiv = styled.div`
  padding-bottom: ${props => (props.hasPadding ? "1em" : "0")};
`;

const StyledTransition = styled.div`
  display: ${props => (props.isHidden ? "none" : "block")};
`;

/* eslint-disable react/prop-types */
const ERROR_SITUATIONS = [
  {
    condition: props =>
      props.expression.left.reason === SELECTED_ANSWER_DELETED,
    message: () => (
      <Alert>
        <AlertTitle>
          The answer used in this condition has been deleted
        </AlertTitle>
        <AlertText>Please select a new answer.</AlertText>
      </Alert>
    ),
  },
  {
    condition: props =>
      props.expression.left.reason === NO_ROUTABLE_ANSWER_ON_PAGE,
    message: props => (
      <Alert>
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
    condition: props => !props.canAddCondition && props.operator === "Or",
    message: () => (
      <Alert>
        <AlertTitle>
          OR condition is not valid when creating multiple radio rules
        </AlertTitle>
        <AlertText>Select a different answer or delete the rule.</AlertText>
      </Alert>
    ),
  },
  {
    condition: props => !props.canAddCondition,
    message: () => (
      <Alert>
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
  [CHECKBOX]: MultipleChoiceAnswerOptionsSelector,
  [NUMBER]: NumberAnswerSelector,
  [PERCENTAGE]: NumberAnswerSelector,
  [CURRENCY]: NumberAnswerSelector,
  [UNIT]: NumberAnswerSelector,
};

export class UnwrappedBinaryExpressionEditor extends React.Component {
  static fragments = [fragment];

  static propTypes = {
    expression: propType(fragment).isRequired,
    label: PropTypes.string.isRequired,
    expressionGroupId: PropTypes.string.isRequired,
    isOnlyExpression: PropTypes.bool.isRequired,
    isLastExpression: PropTypes.bool.isRequired,
    updateLeftSide: PropTypes.func.isRequired,
    deleteBinaryExpression: PropTypes.func.isRequired,
    createBinaryExpression: PropTypes.func.isRequired,
    canAddCondition: PropTypes.bool.isRequired,
    updateRightSide: PropTypes.func.isRequired,
    updateBinaryExpression: PropTypes.func.isRequired,
    match: CustomPropTypes.match.isRequired,
    className: PropTypes.string,
  };

  id = uniqueId("RoutingCondition");

  static defaultProps = {
    label: "If",
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

  handleAddClick = () => {
    this.props.createBinaryExpression(this.props.expressionGroupId);
  };

  handleUpdateRightSide = updateField => {
    this.props.updateRightSide(this.props.expression, updateField);
  };

  handleUpdateCondition = condition => {
    this.props.updateBinaryExpression(this.props.expression, condition);
  };

  renderEditor() {
    if (
      this.props.expression.left.reason === DEFAULT_ROUTING ||
      this.props.expression.left.reason === DEFAULT_SKIP_CONDITION
    ) {
      return <div />;
    }

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
    const {
      className,
      label,
      expression,
      isOnlyExpression,
      isLastExpression,
    } = this.props;

    return (
      <div>
        <Grid align="center">
          <Column gutters={false} cols={1.5}>
            <Label
              htmlFor={this.id}
              data-test="routing-binary-expression-if-label"
            >
              {label}
            </Label>
          </Column>
          <Column gutters={false} cols={8}>
            <Flex>
              <ContentPicker
                path="page.availableRoutingAnswers"
                selectedContentDisplayName={get("left.displayName", expression)}
                onSubmit={this.handleLeftSideChange}
                selectedId={get("left.id", expression)}
                data-test="routing-answer-picker"
              />
            </Flex>
          </Column>
          <Column gutters={false} cols={2.5}>
            <ActionButtons data-test="action-btns">
              <RemoveButton
                onClick={this.handleDeleteClick}
                disabled={isOnlyExpression}
                data-test="btn-remove"
              >
                <IconText icon={IconMinus} hideText>
                  Remove
                </IconText>
              </RemoveButton>
              <AddButton onClick={this.handleAddClick} data-test="btn-add">
                <IconText icon={IconPlus} hideText>
                  Add
                </IconText>
              </AddButton>
            </ActionButtons>
          </Column>
        </Grid>

        <DefaultRouteDiv
          className={className}
          hasPadding={
            this.props.expression.left.reason === DEFAULT_ROUTING ||
            this.props.expression.left.reason === DEFAULT_SKIP_CONDITION ||
            this.props.expression.left.reason === NO_ROUTABLE_ANSWER_ON_PAGE
          }
        >
          <Grid>
            <Column gutters={false} cols={1.5}>
              <ConnectedPath pathEnd={isLastExpression} />
            </Column>
            <Column gutters={false} cols={8}>
              <StyledTransition
                data-test="transition-condition"
                isHidden={
                  this.props.expression.left.reason === DEFAULT_ROUTING ||
                  this.props.expression.left.reason ===
                    DEFAULT_SKIP_CONDITION ||
                  this.props.expression.left.reason ===
                    NO_ROUTABLE_ANSWER_ON_PAGE
                }
              >
                <TransitionGroup>
                  <Transition key="answer">{routingEditor}</Transition>
                </TransitionGroup>
              </StyledTransition>
            </Column>
            <Column cols={2.5} />
          </Grid>
        </DefaultRouteDiv>
      </div>
    );
  }
}

const withMutations = flow(
  withRouter,
  withUpdateLeftSide,
  withDeleteBinaryExpression,
  withCreateBinaryExpression,
  withUpdateRightSide,
  withUpdateBinaryExpression
);

export default withMutations(UnwrappedBinaryExpressionEditor);
