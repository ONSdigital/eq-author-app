import React from "react";
import { propType } from "graphql-anywhere";

import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import RoutingEditor from "./RoutingEditor";
import NoRouting, {
  Title,
  Paragraph,
} from "App/shared/Logic/Routing/NoRouting";
import Transition from "../Transition";

import withCreateRouting from "./withCreateRouting";
import fragment from "./fragment.graphql";
import transformNestedFragments from "utils/transformNestedFragments";
import Panel from "components/Panel";

import { useQuestionnaire } from "components/QuestionnaireContext";

export const UnwrappedRoutingPage = ({ page, createRouting }) => {
  const handleAddRouting = () => createRouting(page.id);

  const { questionnaire } = useQuestionnaire();
  const isLastPage =
    page.position === page.section.pages.length - 1 &&
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
                    ? "Routing is not available for this quesiton"
                    : "No routing rules exist for this question"}
                </Title>
                <Paragraph>
                  {isLastPage
                    ? "You can't route on the last question in a questionnaire."
                    : "Users completing this question will be taken to the next page."}
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
