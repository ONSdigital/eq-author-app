/* eslint-disable import/no-unresolved */
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

export const UnwrappedSkipLogicPage = ({ page, createSkipCondition }) => {
  const handleAddSkipCondtions = () => createSkipCondition(page.id);
  const isFirstQuestion =
    page.position + page.folder.position + page.section.position === 0;

  return (
    <div data-test="skip-condition-editor">
      <TransitionGroup>
        {page.skipConditions ? (
          <Transition key="skip-condition-set" exit={false}>
            <SkipLogicEditor
              pageId={page.id}
              skipConditions={page.skipConditions}
            />
          </Transition>
        ) : (
          <Transition key="skip-condition-set-empty" exit={false}>
            <Panel>
              <NoSkipConditions
                onAddSkipCondtions={handleAddSkipCondtions}
                data-test="skip-condition-set-empty-msg"
                isFirstQuestion={isFirstQuestion}
              >
                All users will see this question if no skip logic is added.
              </NoSkipConditions>
            </Panel>
          </Transition>
        )}
      </TransitionGroup>
    </div>
  );
};

UnwrappedSkipLogicPage.propTypes = {
  page: propType(transformNestedFragments(fragment, SkipLogicEditor.fragments))
    .isRequired,
  createSkipCondition: PropTypes.func.isRequired,
};

UnwrappedSkipLogicPage.fragments = [fragment, ...SkipLogicEditor.fragments];

export default withCreateSkipLogic(UnwrappedSkipLogicPage);
