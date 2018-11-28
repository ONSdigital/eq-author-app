import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";

import routingRuleSetFragment from "graphql/fragments/routing-rule-set.graphql";

import Transition from "./Transition";
import Button from "components/Button";
import IconText from "components/IconText";
import RoutingRuleDestinationSelector from "./RoutingRuleDestinationSelector";
import RoutingRule from "./RoutingRule";

import IconAddRule from "./icon-add-rule.svg?inline";
import { colors, radius } from "constants/theme";

const AddRuleButton = styled(Button)`
  width: 100%;
  margin-bottom: 2em;
  padding: 0.5em;
`;

const Box = styled.div`
  border: 1px solid ${colors.bordersLight};
  border-radius: ${radius};
  opacity: ${props => (props.disabled ? "0.5" : "1")};
`;

const RoutingRuleSet = ({
  ruleSet,
  destinations,
  onAddRoutingRule,
  onElseChange,
  ...otherProps
}) => {
  const handleAddClick = () => onAddRoutingRule(ruleSet.id);
  const handleElseChange = value =>
    onElseChange({ id: ruleSet.id, else: value });

  return (
    <React.Fragment>
      <TransitionGroup>
        {ruleSet.routingRules.map((rule, index) => (
          <Transition key={rule.id}>
            <RoutingRule
              rule={rule}
              title={index > 0 ? "Or" : null}
              key={rule.id}
              destinations={destinations}
              {...otherProps}
            />
          </Transition>
        ))}
      </TransitionGroup>
      <AddRuleButton
        variant="secondary"
        small
        onClick={handleAddClick}
        data-test="btn-add-rule"
      >
        <IconText icon={IconAddRule}>Add rule</IconText>
      </AddRuleButton>
      <Box>
        <RoutingRuleDestinationSelector
          id="else"
          label="ELSE"
          value={ruleSet.else}
          destinations={destinations}
          onChange={handleElseChange}
          data-test="select-else"
        />
      </Box>
    </React.Fragment>
  );
};

RoutingRuleSet.fragments = {
  RoutingRuleSet: routingRuleSetFragment
};

RoutingRuleSet.propTypes = {
  ruleSet: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  destinations: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onAddRoutingRule: PropTypes.func.isRequired,
  onElseChange: PropTypes.func.isRequired
};

export default RoutingRuleSet;
