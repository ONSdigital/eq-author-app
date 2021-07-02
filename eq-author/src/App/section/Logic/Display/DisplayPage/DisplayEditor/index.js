import React from "react";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
// import { flow } from "lodash/fp";

import Button from "components/buttons/Button";

import Transition from "components/transitions/BounceTransition";
// import DestinationSelector from "App/page/Logic/Routing/DestinationSelector";

// import transformNestedFragments from "utils/transformNestedFragments";

// import fragment from "./fragment.graphql";
// import withUpdateRouting from "./withUpdateRouting";
// import withCreateRule from "./withCreateRule";
// import RuleEditor from "./RuleEditor";

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

const DisplayEditor = ({ display, updateDisplay, createRule }) => {
  //   const handleAddClick = () => {
  //     createRule(display.id);
  //   };

  //   handleElseChange = (destination) => {
  //     this.props.updateRouting({
  //       display,
  //       else: destination,
  //     });
  //   };

  return (
    <>
      {/* <TransitionGroup component={null}>
        {display.rules.map((rule, index) => (
          <Transition key={rule.id}>
            <RuleEditor
              rule={rule}
              key={rule.id}
              ifLabel={index > 0 ? LABEL_ELSE_IF : LABEL_IF}
            />
          </Transition>
        ))}
      </TransitionGroup> */}
      <AddRuleButton
        variant="secondary"
        small
        // onClick={handleAddClick}
        data-test="btn-add-rule"
      >
        Add rule
      </AddRuleButton>

      {/* <DestinationSelector
        id="else"
        label={LABEL_ELSE}
        value={display?.else}
        // onChange={handleElseChange}
        data-test="select-else"
      /> */}
    </>
  );
};

DisplayEditor.propTypes = {
  updateDisplay: PropTypes.func.isRequired,
  createRule: PropTypes.func.isRequired,
};

export default DisplayEditor;
