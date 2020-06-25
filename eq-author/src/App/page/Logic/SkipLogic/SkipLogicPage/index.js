/* eslint-disable import/no-unresolved */
import React from "react";

import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import SkipLogicEditor from "./SkipLogicEditor";
import NoSkipConditions from "./NoSkipConditions";
import Transition from "../Transition";

import withCreateSkipLogic from "./withCreateSkipLogic";
import fragment from "./fragment.graphql";
import Panel from "components/Panel";

export class UnwrappedSkipLogicPage extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    page: PropTypes.object,
    createSkipCondition: PropTypes.func.isRequired,
  };

  static fragments = [fragment];

  handleAddSkipCondtions = () =>
    this.props.createSkipCondition(this.props.page.id);

  renderContent(page) {
    if (!page.skipConditions) {
      return (
        <Transition key="skip-condition-set-empty" exit={false}>
          <Panel>
            <NoSkipConditions
              title="No skip conditions exist for this question"
              onAddSkipCondtions={this.handleAddSkipCondtions}
              data-test="skip-condition-set-empty-msg"
            >
              Users completing this question will be taken to the next page.
            </NoSkipConditions>
          </Panel>
        </Transition>
      );
    }

    return (
      <Transition key="skip-condition-set" exit={false}>
        <SkipLogicEditor page={page} />
      </Transition>
    );
  }

  render() {
    const { page } = this.props;
    return (
      <div data-test="skip-condition-editor">
        <TransitionGroup>{this.renderContent(page)}</TransitionGroup>
      </div>
    );
  }
}

export default withCreateSkipLogic(UnwrappedSkipLogicPage);
