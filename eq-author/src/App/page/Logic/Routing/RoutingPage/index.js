import React from "react";
import { propType } from "graphql-anywhere";

import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import RoutingEditor from "./RoutingEditor";
import NoRouting from "./NoRouting";
import Transition from "../Transition";

import withCreateRouting from "./withCreateRouting";
import fragment from "./fragment.graphql";
import transformNestedFragments from "utils/transformNestedFragments";
import Panel from "components/Panel";

export class UnwrappedRoutingPage extends React.Component {
  static propTypes = {
    page: propType(transformNestedFragments(fragment, RoutingEditor.fragments))
      .isRequired,
    createRouting: PropTypes.func.isRequired,
  };

  static fragments = [fragment, ...RoutingEditor.fragments];

  handleAddRouting = () => this.props.createRouting(this.props.page.id);

  renderContent(page) {
    if (!page.routing) {
      return (
        <Transition key="routing-rule-set-empty" exit={false}>
          <Panel>
            <NoRouting
              title="No routing rules exist for this question"
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
        <RoutingEditor routing={page.routing} />
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

export default withCreateRouting(UnwrappedRoutingPage);
