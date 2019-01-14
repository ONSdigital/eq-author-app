import React from "react";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import { flow } from "lodash/fp";

import Button from "components/buttons/Button";
import IconText from "components/IconText";

import Transition from "App/questionPage/Routing/Transition";
import DestinationSelector from "App/questionPage/Routing/DestinationSelector";
import IconAddRule from "App/questionPage/Routing/icon-add-rule.svg?inline";

import { colors, radius } from "constants/theme";
import transformNestedFragments from "utils/transformNestedFragments";

import fragment from "./fragment.graphql";
import withUpdateRouting from "./withUpdateRouting";
import withCreateRule from "./withCreateRule";
import RuleEditor from "./RuleEditor";

const AddRuleButton = styled(Button)`
  width: 100%;
  margin-bottom: 2em;
  padding: 0.5em;
`;

const Box = styled.div`
  border: 1px solid ${colors.bordersLight};
  border-radius: ${radius};
  opacity: 1;
`;

export class UnwrappedRoutingEditor extends React.Component {
  static fragments = [fragment, ...RuleEditor.fragments];

  static propTypes = {
    routing: propType(transformNestedFragments(fragment, RuleEditor.fragments))
      .isRequired,
    updateRouting: PropTypes.func.isRequired,
    createRule: PropTypes.func.isRequired,
  };

  handleAddClick = () => {
    this.props.createRule(this.props.routing.id);
  };

  handleElseChange = destination => {
    this.props.updateRouting({
      ...this.props.routing,
      else: destination,
    });
  };

  render() {
    const { routing } = this.props;
    return (
      <>
        <TransitionGroup>
          {routing.rules.map((rule, index) => (
            <Transition key={rule.id} exit={false}>
              <RuleEditor
                rule={rule}
                title={index > 0 ? "Or" : null}
                key={rule.id}
              />
            </Transition>
          ))}
        </TransitionGroup>
        <AddRuleButton
          variant="secondary"
          small
          onClick={this.handleAddClick}
          data-test="btn-add-rule"
        >
          <IconText icon={IconAddRule}>Add rule</IconText>
        </AddRuleButton>
        <Box>
          <DestinationSelector
            id="else"
            label="ELSE"
            value={routing.else}
            onChange={this.handleElseChange}
            data-test="select-else"
          />
        </Box>
      </>
    );
  }
}

const withMutations = flow(
  withUpdateRouting,
  withCreateRule
);

export default withMutations(UnwrappedRoutingEditor);
