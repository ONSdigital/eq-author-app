import React from "react";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import { colors } from "constants/theme";

import RoutingEditor from "./RoutingEditor";
import NoRouting from "./NoRouting";
import Transition from "../Transition";

import withCreateRouting from "./withCreateRouting";
import fragment from "./fragment.graphql";
import transformNestedFragments from "utils/transformNestedFragments";

const Title = styled.h2`
  padding: 0.5em 1em;
  color: #666;
  font-size: 1.4em;
  border-bottom: 1px solid ${colors.lightGrey};
  margin: 0;
`;

const Padding = styled.div`
  padding: 2em;
`;

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
          <NoRouting
            title="No routing rules exist for this question"
            onAddRouting={this.handleAddRouting}
            data-test="routing-rule-set-empty-msg"
          >
            Users completing this question will be taken to the next page.
          </NoRouting>
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
        <Title>{page.displayName}</Title>
        <Padding>
          <TransitionGroup>{this.renderContent(page)}</TransitionGroup>
        </Padding>
      </div>
    );
  }
}

export default withCreateRouting(UnwrappedRoutingPage);
