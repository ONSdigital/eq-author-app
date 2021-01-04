import React from "react";

import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import SkipLogicEditor from "./SkipLogicEditor";
import NoSkipConditions from "./NoSkipConditions";
import Transition from "../Transition";

import withCreateSkipLogic from "./withCreateSkipLogic";
import fragment from "./fragment.graphql";
import transformNestedFragments from "utils/transformNestedFragments";
import Panel from "components/Panel";

export class UnwrappedSkipLogicPage extends React.Component {
  static propTypes = {
    page: propType(
      transformNestedFragments(fragment, SkipLogicEditor.fragments)
    ).isRequired,
    createSkipCondition: PropTypes.func.isRequired,
  };

  static fragments = [fragment, ...SkipLogicEditor.fragments];

  handleAddSkipCondtions = () =>
    this.props.createSkipCondition(this.props.page.id);

  renderContent(page) {
    const isFirstQuestion = page.section.position === 0 && page.position === 0;
    if (!page.skipConditions) {
      return (
        <Transition key="skip-condition-set-empty" exit={false}>
          <Panel>
            <NoSkipConditions
              onAddSkipCondtions={this.handleAddSkipCondtions}
              data-test="skip-condition-set-empty-msg"
              isFirstQuestion={isFirstQuestion}
            >
              All users will see this question if no skip logic is added.
            </NoSkipConditions>
          </Panel>
        </Transition>
      );
    }

    return (
      <Transition key="skip-condition-set" exit={false}>
        <SkipLogicEditor
          pageId={page.id}
          skipConditions={page.skipConditions}
        />
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
