import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";

import Button from "components/buttons/Button";
import { colors } from "constants/theme";

import Transition from "components/transitions/BounceTransition";
import DisplayConditionEditor from "./RuleEditor/DisplayConditionEditor";

const AddDisplayConditionButton = styled(Button)`
  display: block;
  margin: 2em auto;
  padding: 0.8em 2em;
  border-radius: 2em;
  border-width: 2px;
`;

const Footer = styled.div`
  padding: 0.5em 1em;
  margin-top: -1px;
  border-bottom: 3px solid ${colors.primary};
  border-left: 1px solid ${colors.lightMediumGrey};
  border-right: 1px solid ${colors.lightMediumGrey};
  display: flex;
  align-items: center;
`;

const DisplayEditor = ({ onAddDisplay, displayConditions, sectionId }) => {
  return (
    <>
      <TransitionGroup>
        {displayConditions.map((expressionGroup, index) => (
          <Transition key={expressionGroup.id}>
            <DisplayConditionEditor
              sectionId={sectionId}
              expressionGroupIndex={index}
              expressionGroup={expressionGroup}
              key={expressionGroup.id}
            />
          </Transition>
        ))}
      </TransitionGroup>
      <Footer />
      <AddDisplayConditionButton
        variant="secondary"
        small
        onClick={onAddDisplay}
        data-test="btn-add-display-condition"
      >
        Add OR statement
      </AddDisplayConditionButton>
    </>
  );
};

DisplayEditor.propTypes = {
  sectionId: PropTypes.string.isRequired,
  noun: PropTypes.string,
  onAddDisplay: PropTypes.func.isRequired,
  displayConditions: PropTypes.array.isRequired, //eslint-disable-line
};

export default DisplayEditor;
