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

  const isFirst =
    page?.position === 0 &&
    page?.section?.position === 0 &&
    (isFolder || page?.folder?.position === 0);

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
                title={
                  isFirst
                    ? `Skip logic not available for this ${noun}`
                    : `No skip conditions exist for this ${noun}`
                }
                paragraph={
                  isFirst
                    ? `You can't add skip logic to the first ${noun} in a questionnaire`
                    : `All users will see ${
                        isFolder
                          ? "the questions in this folder"
                          : "this question"
                      } if no skip logic is added`
                }
                disabled={isFirst}
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
