import React from "react";
import styled from "styled-components";

import DeleteButton from "components/DeleteButton";
import IconClose from "./icon-close.svg?inline";
import { PropTypes } from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { Grid, Column } from "components/Grid";
import { NavLink } from "react-router-dom";

import { RADIO, NUMBER, CURRENCY } from "constants/answer-types";

import svgPath from "./path.svg";
import svgPathEnd from "./path-end.svg";
import IconText from "components/IconText";
import {
  get,
  isNil,
  isEmpty,
  lowerCase,
  uniqueId,
  first,
  flow,
  negate,
  overSome
} from "lodash";
import MultipleChoiceAnswerOptionsSelector from "components/routing/MultipleChoiceAnswerOptionsSelector";
import NumberAnswerSelector from "components/routing/NumberAnswerSelector";
import GroupedSelect from "./GroupedSelect";
import Transition from "components/routing/Transition";
import { TransitionGroup } from "react-transition-group";
import { Alert, AlertTitle, AlertText } from "components/routing/Alert";
import { buildPagePath } from "utils/UrlUtils";
import isAnswerValidForRouting from "./isAnswerValidForRouting";

import routingConditionFragment from "graphql/fragments/routing-condition.graphql";

const Label = styled.label`
  width: 100%;
  display: inline-block;
  font-size: 0.9em;
  letter-spacing: 0.05em;
  font-weight: bold;
  text-align: center;
  align-self: center;
`;

export const PageSelect = styled(GroupedSelect).attrs({
  onChange: props => ({ value }) => props.onChange(value)
})`
  margin: 0;
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

const firstAnswerIsValid = flow(
  first,
  isAnswerValidForRouting
);
const shouldDisable = overSome([isEmpty, negate(firstAnswerIsValid)]);

const convertToGroups = sections =>
  sections.map(section => ({
    label: section.displayName,
    id: section.id,
    options: section.pages.map(page => ({
      label: page.displayName,
      value: page.id,
      disabled: shouldDisable(page.answers)
    }))
  }));

const renderNoAnswer = params => (
  <Transition exit={false}>
    <Alert data-test="no-answer-msg">
      <AlertTitle>No answers have been added to this question yet.</AlertTitle>
      <AlertText>
        First, <NavLink to={buildPagePath(params)}>add an answer</NavLink> to
        continue.
      </AlertText>
    </Alert>
  </Transition>
);

const renderUnsupportedAnswer = answer => (
  <Transition key="answer" exit={false}>
    <Alert data-test="invalid-answer-type-msg">
      <AlertTitle>Routing is not available for this type of answer</AlertTitle>
      <AlertText>
        You cannot route on &lsquo;
        {lowerCase(answer.type)}
        &rsquo; answers.
      </AlertText>
    </Alert>
  </Transition>
);

const renderDeletedQuestion = () => (
  <Transition key="answer" exit={false}>
    <Alert data-test="deleted-answer-msg">
      <AlertTitle>
        The question this condition referred to has been deleted
      </AlertTitle>
      <AlertText>
        Please select a new question from the dropdown above.
      </AlertText>
    </Alert>
  </Transition>
);

const renderCannotAddAndCondition = () => (
  <Transition key="answer" exit={false}>
    <Alert data-test="and-not-valid-msg">
      <AlertTitle>
        AND condition not valid with &lsquo;radio button&rsquo; answer
      </AlertTitle>
      <AlertText>Please select a different question.</AlertText>
    </Alert>
  </Transition>
);

const renderMultipleChoiceEditor = (condition, onToggleOption) => (
  <Transition key="answer" exit={false}>
    <MultipleChoiceAnswerOptionsSelector
      condition={condition}
      onOptionSelectionChange={onToggleOption}
    />
  </Transition>
);

const renderNumberEditor = (
  condition,
  handleComparatorChange,
  handleValueChange
) => (
  <Transition key="answer" exit={false}>
    <NumberAnswerSelector
      condition={condition}
      onComparatorChange={handleComparatorChange}
      handleValueChange={handleValueChange}
    />
  </Transition>
);

class RoutingCondition extends React.Component {
  static propTypes = {
    ruleId: PropTypes.string.isRequired,
    condition: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    sections: PropTypes.arrayOf(CustomPropTypes.section).isRequired,
    onConditionChange: PropTypes.func.isRequired,
    onUpdateConditionValue: PropTypes.func.isRequired,
    onToggleOption: PropTypes.func.isRequired,
    onRemove: PropTypes.func,
    label: PropTypes.oneOf(["IF", "AND"]).isRequired,
    match: CustomPropTypes.match,
    canAddAndCondition: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.pageSelectIsValid = true;

    this.id = uniqueId("RoutingCondition");

    this.value = get(props.condition, "questionPage.id", null);
  }

  static defaultProps = {
    label: "IF"
  };

  static fragments = {
    RoutingCondition: routingConditionFragment
  };

  handleRemove = this.props.onRemove
    ? () => this.props.onRemove(this.props.ruleId, this.props.condition.id)
    : null;

  handlePageChange = ({ value }) => {
    this.props.onConditionChange({
      id: this.props.condition.id,
      questionPageId: value
    });
  };

  handleComparatorChange = (otherProps, { value }) =>
    this.props.onConditionChange({
      id: this.props.condition.id,
      questionPageId: otherProps.questionPageId,
      comparator: value
    });

  handleValueChange = ({ value, name }) =>
    this.props.onUpdateConditionValue({ id: name, customNumber: value });

  renderEditor(condition) {
    let routingEditor;
    let isValid = true;

    if (isNil(condition.questionPage)) {
      isValid = false;
      routingEditor = renderDeletedQuestion();
    } else if (isNil(condition.answer)) {
      this.value = null;
      isValid = false;
      routingEditor = renderNoAnswer(this.props.match.params);
    } else if (!isAnswerValidForRouting(condition.answer)) {
      this.value = null;
      isValid = false;
      routingEditor = renderUnsupportedAnswer(condition.answer);
    } else if (!this.props.canAddAndCondition) {
      isValid = false;
      routingEditor = renderCannotAddAndCondition();
    } else {
      isValid = true;
      this.value = get(this.props.condition, "questionPage.id", null);
      const type = get(condition, "answer.type");
      if (type === RADIO) {
        routingEditor = renderMultipleChoiceEditor(
          condition,
          this.props.onToggleOption
        );
      } else if ([CURRENCY, NUMBER].includes(type)) {
        routingEditor = renderNumberEditor(
          condition,
          this.handleComparatorChange,
          this.handleValueChange
        );
      }
    }

    return {
      routingEditor,
      isValid
    };
  }

  render() {
    const { routingEditor, isValid } = this.renderEditor(this.props.condition);

    return (
      <div data-test="routing-condition">
        <Grid align="center">
          <Column gutters={false} cols={1}>
            <Label htmlFor={this.id}>{this.props.label}</Label>
          </Column>
          <Column gutters={false} cols={10}>
            <PageSelect
              value={this.value}
              valid={isValid}
              onChange={this.handlePageChange}
              groups={convertToGroups(this.props.sections)}
              id={this.id}
            />
          </Column>
          <Column gutters={false} cols={1}>
            <RemoveButton
              onClick={this.handleRemove}
              disabled={!this.props.onRemove}
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
            <ConnectedPath pathEnd={isNil(this.props.condition.answer)} />
          </Column>
          <Column gutters={false} cols={10}>
            <TransitionGroup>{routingEditor}</TransitionGroup>
          </Column>
          <Column cols={1} />
        </Grid>
      </div>
    );
  }
}

export default RoutingCondition;
