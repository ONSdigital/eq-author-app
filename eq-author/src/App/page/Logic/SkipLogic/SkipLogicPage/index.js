/* eslint-disable import/no-unresolved */
import React from "react";

import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import SkipLogicEditor from "./SkipLogicEditor";
import NoRouting from "./NoRouting";
import Transition from "../Transition";

import withCreateSkipLogic from "./withCreateSkipLogic";
import fragment from "./fragment.graphql";
import Panel from "components/Panel";

export class UnwrappedSkipLogicPage extends React.Component {
  static propTypes = {
    page: PropTypes.object,
    createSkipCondition: PropTypes.func.isRequired,
  };

  static fragments = [fragment];

  handleAddRouting = () => this.props.createSkipCondition(this.props.page.id);

  renderContent(page) {
    if (!page.skipConditions) {
      return (
        <Transition key="routing-rule-set-empty" exit={false}>
          <Panel>
            <NoRouting
              title="No skip conditions exist for this question"
              onAddRouting={this.handleAddRouting}
              data-test="routing-rule-set-empty-msg"
            >
              Users completing this question will be taken to the next page.
            </NoRouting>
          </Panel>
        </Transition>
      );
    }

    return (
      <Transition key="routing-rule-set" exit={false}>
        <SkipLogicEditor page={page} />
      </Transition>
    );
  }

  render() {
    const { page } = this.props;
    return (
      <div data-test="routing-editor">
        <TransitionGroup>{this.renderContent(page)}</TransitionGroup>
      </div>
    );
  }
}

export default withCreateSkipLogic(UnwrappedSkipLogicPage);
