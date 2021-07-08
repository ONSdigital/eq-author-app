import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import { propType } from "graphql-anywhere";
import { flow } from "lodash/fp";

import BounceTransition from "components/transitions/BounceTransition";
// import DestinationSelector from "App/page/Logic/Routing/DestinationSelector";
import BinaryExpressionEditor from "App/page/Logic/BinaryExpressionEditor";

import { Select, Label } from "components/Forms";
import Button from "components/buttons/Button";

import { colors } from "constants/theme";
import { RADIO } from "constants/answer-types";

import { expressionGroupErrors } from "constants/validationMessages";
import ValidationError from "components/ValidationError";

const LABEL_THEN = "Then";

const Expressions = styled.div`
  background: white;
  padding-top: 1em;
  border-left: 1px solid ${colors.lightMediumGrey};
  border-right: 1px solid ${colors.lightMediumGrey};
`;

const Rule = styled.div`
  margin-bottom: 2em;
`;

const Transition = styled(BounceTransition)`
  margin-bottom: 2em;
`;

const GroupOperatorValidationError = styled(ValidationError)`
  margin-bottom: 0;
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
  margin-bottom: 0;
  line-height: 1.25;
`;

export const GroupOperatorLabel = styled(Label)`
  margin: 0.5em 0 0 0.5em;
`;

const RemoveRuleButton = styled(Button).attrs({
  variant: "tertiary",
  small: true,
})`
  margin-left: auto;
  padding: 0.2em;
`;

const RuleEditorProps = {
  ifLabel: PropTypes.string,
  deleteRule: PropTypes.func.isRequired,
  updateRule: PropTypes.func.isRequired,
  updateExpressionGroup: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export const RuleEditor = ({
  ifLabel = "If",
  deleteRule,
  updateRule,
  updateExpressionGroup,
  className,
}) => {
  const existingRadioConditions = {};
  const expressions = [];

  return (
    <>
      {/* <GroupOperatorValidationError right={false} /> */}

      <Rule data-test="display-rule" className={className}>
        <Header>
          <Label inline> Display this section </Label>
          <RemoveRuleButton
            //   onClick={handleDeleteClick}
            data-test="btn-remove-display-condition"
          >
            Remove logic rule
          </RemoveRuleButton>
        </Header>
        {/* <DestinationSelector
          label={LABEL_THEN}
          // onChange={handleDestinationChange}
          // value={destination}
          data-test="select-then"
        /> */}
      </Rule>
    </>
  );
};

export default RuleEditor;
