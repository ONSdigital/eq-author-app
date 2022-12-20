import React from "react";

import { TransitionGroup } from "react-transition-group";
import { propType } from "graphql-anywhere";

import SkipLogicEditor from "./SkipLogicEditor";
import NoSkipConditions from "./NoSkipConditions";
import Transition from "../Transition";

import fragment from "./fragment.graphql";
import Panel from "components/Panel";

import { useCreateSkipCondition } from "../mutations.js";

const SkipLogicPage = ({ page }) => {
  const createSkipCondition = useCreateSkipCondition({ parentId: page.id });
  const isFolder = page?.__typename === "Folder";

  const noun = isFolder ? "folder" : "question";

  return (
    <div data-test="skip-condition-editor">
      <TransitionGroup>
        <Transition
          key={`skip-condition-set${page.skipConditions ? "" : "-empty"}`}
          exit={false}
        >
          {page.skipConditions ? (
            <SkipLogicEditor
              pageId={page.id}
              noun={noun}
              skipConditions={page.skipConditions}
              onAddSkipConditions={createSkipCondition}
            />
          ) : (
            <Panel>
              <NoSkipConditions
                onAddSkipConditions={createSkipCondition}
                data-test="skip-condition-set-empty-msg"
                title={`No skip conditions exist for this ${noun}`}
                paragraph={`All users will see ${
                  isFolder ? "the questions in this folder" : "this question"
                } if no skip logic is added`}
              >
                All users will see this question if no skip logic is added.
              </NoSkipConditions>
            </Panel>
          )}
        </Transition>
      </TransitionGroup>
    </div>
  );
};

SkipLogicPage.propTypes = {
  page: propType(fragment).isRequired,
};

export default SkipLogicPage;
