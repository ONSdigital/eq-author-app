import React from "react";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import PropTypes from "prop-types";
import { flow } from "lodash/fp";

import Button from "components/buttons/Button";
import Reorder from "components/Reorder";

import DestinationSelector from "App/page/Logic/Routing/DestinationSelector";

import transformNestedFragments from "utils/transformNestedFragments";

import fragment from "./fragment.graphql";
import withUpdateRouting from "./withUpdateRouting";
import withCreateRule from "./withCreateRule";
import RuleEditor from "./RuleEditor";
import RoutingTransition from "./RoutingTransition";
import withMoveRule from "./withMoveRule";

export const LABEL_IF = "IF";
export const LABEL_ELSE = "Else";
export const LABEL_ELSE_IF = "ELSE IF";

const AddRuleButton = styled(Button)`
  display: block;
  margin: 2em auto;
  padding: 0.8em 2em;
  border-radius: 2em;
  border-width: 2px;
`;

export class UnwrappedRoutingEditor extends React.Component {
  static fragments = [fragment, ...RuleEditor.fragments];

  static propTypes = {
    routing: propType(transformNestedFragments(fragment, RuleEditor.fragments))
      .isRequired,
    updateRouting: PropTypes.func.isRequired,
    createRule: PropTypes.func.isRequired,
    moveRule: PropTypes.func.isRequired,
  };

  handleAddClick = () => {
    this.props.createRule(this.props.routing.id);
  };

  handleElseChange = (destination) => {
    this.props.updateRouting({
      ...this.props.routing,
      else: destination,
    });
  };

  render() {
    const { routing, moveRule: handleMoveRule } = this.props;

    return (
      <>
        <Reorder
          list={routing.rules}
          onMove={handleMoveRule}
          Transition={RoutingTransition}
        >
          {(props, rule) => (
            <RuleEditor
              routing={props.routing}
              rule={rule}
              key={rule.id}
              ifLabel={
                routing.rules.indexOf(rule) > 0 ? LABEL_ELSE_IF : LABEL_IF
              }
              {...props}
            />
          )}
        </Reorder>
        <AddRuleButton
          variant="secondary"
          small
          onClick={this.handleAddClick}
          data-test="btn-add-rule"
        >
          Add rule
        </AddRuleButton>

        <DestinationSelector
          id="else"
          label={LABEL_ELSE}
          value={routing.else}
          onChange={this.handleElseChange}
          data-test="select-else"
        />
      </>
    );
  }
}

const withMutations = flow(withMoveRule, withUpdateRouting, withCreateRule);

export default withMutations(UnwrappedRoutingEditor);
