import React from "react";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import { flow } from "lodash/fp";

import Button from "components/buttons/Button";
import { colors } from "constants/theme";
import { Label } from "components/Forms";

import Transition from "App/page/Logic/Routing/Transition";

import withCreateSkipCondition from "./withCreateSkipCondition";

import SkipConditionEditor from "./SkipConditionEditor";

const AddRuleButton = styled(Button)`
  display: block;
  margin: 2em auto;
  padding: 0.8em 2em;
  border-radius: 2em;
  border-width: 2px;
`;

const Footer = styled.div`
  background: ${colors.lightMediumGrey};
  padding: 0.5em 1em;
  margin-top: -1px;
  border-bottom: 3px solid ${colors.primary};
  display: flex;
  align-items: center;
`;

export class UnwrappedSkipLogicEditor extends React.Component {
  static propTypes = {
    page: PropTypes.object,
    createSkipCondition: PropTypes.func.isRequired,
  };

  handleAddClick = () => {
    this.props.createSkipCondition(this.props.page.id);
  };

  render() {
    const { skipConditions } = this.props.page;

    return (
      <>
        <TransitionGroup>
          {skipConditions.map((expressionGroup, index) => (
            <Transition key={expressionGroup.id}>
              <SkipConditionEditor
                pageId={this.props.page.id}
                expressionGroupIndex={index}
                expressionGroup={expressionGroup}
                key={expressionGroup.id}
              />
            </Transition>
          ))}
        </TransitionGroup>
        <Footer>
          <Label>Then skip [{this.props.page.displayName}]</Label>
        </Footer>
        <AddRuleButton
          variant="secondary"
          small
          onClick={this.handleAddClick}
          data-test="btn-add-rule"
        >
          Add a different statement
        </AddRuleButton>
      </>
    );
  }
}

const withMutations = flow(withCreateSkipCondition);

export default withMutations(UnwrappedSkipLogicEditor);
