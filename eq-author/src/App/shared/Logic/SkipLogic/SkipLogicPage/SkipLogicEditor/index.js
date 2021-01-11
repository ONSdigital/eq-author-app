import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";

import Button from "components/buttons/Button";
import { colors } from "constants/theme";

import Transition from "App/page/Logic/Routing/Transition";
import { propType } from "graphql-anywhere";
import fragment from "./fragment.graphql";
import SkipConditionEditor from "./SkipConditionEditor";

const AddSkipConditionButton = styled(Button)`
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

export default class UnwrappedSkipLogicEditor extends React.Component {
  static propTypes = {
    pageId: PropTypes.string.isRequired,
    skipConditions: propType(fragment).isRequired,
    onAddSkipConditions: PropTypes.func.isRequired,
  };

  handleClick = this.props.onAddSkipConditions;

  render() {
    return (
      <>
        <TransitionGroup>
          {this.props.skipConditions.map((expressionGroup, index) => (
            <Transition key={expressionGroup.id}>
              <SkipConditionEditor
                pageId={this.props.pageId}
                expressionGroupIndex={index}
                expressionGroup={expressionGroup}
                key={expressionGroup.id}
              />
            </Transition>
          ))}
        </TransitionGroup>
        <Footer />
        <AddSkipConditionButton
          variant="secondary"
          small
          onClick={this.handleClick}
          data-test="btn-add-skip-condition"
        >
          Add OR statement
        </AddSkipConditionButton>
      </>
    );
  }
}
