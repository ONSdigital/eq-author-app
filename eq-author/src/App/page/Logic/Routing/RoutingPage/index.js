import React from "react";
import { propType } from "graphql-anywhere";

import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import RoutingEditor from "./RoutingEditor";
import NoRouting, {
  Title,
  Paragraph,
} from "App/shared/Logic/Routing/NoRouting";
import Transition from "components/transitions/BounceTransition";

import withCreateRouting from "./withCreateRouting";
import fragment from "./fragment.graphql";
import transformNestedFragments from "utils/transformNestedFragments";
import Panel from "components/Panel";

import { useQuestionnaire } from "components/QuestionnaireContext";

export const messages = {
  ROUTING_NOT_AVAILABLE: "Routing is not available for this question",
  NO_RULES_EXIST: "No routing rules exist for this question",
  LAST_PAGE: "You can't route on the last question in a questionnaire.",
  DEFAULT_ROUTING:
    "Users completing this question will be taken to the next page.",
};

export const UnwrappedRoutingPage = ({ page, createRouting }) => {
  const handleAddRouting = () => createRouting(page.id);

  const { questionnaire } = useQuestionnaire();
  const isLastPage =
    page.position === page.folder.pages.length - 1 &&
    page.folder.position === page.section.folders.length - 1 &&
    page.section.position === questionnaire?.sections?.length - 1;

  return (
    <div data-test="routing-editor">
      <TransitionGroup>
        <Transition
          key={page.routing ? "routing-rule-set" : "routing-rule-set-empty"}
        >
          {page.routing ? (
            <RoutingEditor routing={page.routing} />
          ) : (
            <Panel>
              <NoRouting
                onAddRouting={handleAddRouting}
                data-test="routing-rule-set-empty-msg"
                disabled={isLastPage}
              >
                <Title>
                  {isLastPage
                    ? messages.ROUTING_NOT_AVAILABLE
                    : messages.NO_RULES_EXIST}
                </Title>
                <Paragraph>
                  {isLastPage ? messages.LAST_PAGE : messages.DEFAULT_ROUTING}
                </Paragraph>
              </NoRouting>
            </Panel>
          )}
        </Transition>
      </TransitionGroup>
    </div>
  );
};

UnwrappedRoutingPage.propTypes = {
  page: propType(transformNestedFragments(fragment, RoutingEditor.fragments))
    .isRequired,
  createRouting: PropTypes.func.isRequired,
};

UnwrappedRoutingPage.fragments = [fragment, ...RoutingEditor.fragments];

export default withCreateRouting(UnwrappedRoutingPage);
