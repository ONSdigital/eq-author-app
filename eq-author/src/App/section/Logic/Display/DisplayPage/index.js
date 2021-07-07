import React from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";

import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import CREATE_DISPLAY_MUTATION from "graphql/createDisplayCondition.graphql";

import DisplayEditor from "./DisplayEditor";
import NoDisplayLogic from "App/shared/Logic/Display/NoDisplayLogic";

import Panel from "components/Panel";
import Transition from "components/transitions/BounceTransition";

import { useQuestionnaire } from "components/QuestionnaireContext";

const messages = {
  NO_LOGIC_EXISTS: "No display logic exists for this section",
  HUB_ACTIVE:
    "You can only add display logic when hub navigation is turned on. You can turn on hub navigation in Settings.",
  DEFAULT_DISPLAY:
    "All respondents will see this section unless display logic is added. When you add display logic rules,  the section will only show to respondents if the conditions of any of the rules are met.",
};

const Title = styled.h2`
  font-size: 1.8em;
  font-weight: 600;
  margin-bottom: 0.5em;
`;

const Paragraph = styled.p`
  margin: 0;
`;

export const DisplayPageContent = ({ section }) => {
  const [useCreateDisplayCondition] = useMutation(CREATE_DISPLAY_MUTATION, {
    variables: { input: { sectionId: section.id } },
  });

  return (
    <div data-test="display-page-content">
      <TransitionGroup>
        <Transition
          key={
            section.displayConditions
              ? "display-rule-set"
              : "display-rule-set-empty"
          }
        >
          {section.displayConditions ? (
            <DisplayEditor display={section.displayConditions} />
          ) : (
            <Panel>
              <NoDisplayLogic
                onAddDisplay={useCreateDisplayCondition}
                data-test="display-conditions-empty"
              >
                <Title>{messages.NO_LOGIC_EXISTS}</Title>
                <Paragraph>{messages.DEFAULT_DISPLAY}</Paragraph>
              </NoDisplayLogic>
            </Panel>
          )}
        </Transition>
      </TransitionGroup>
    </div>
  );
};

DisplayPageContent.propTypes = {
  page: CustomPropTypes.page,
};

export default DisplayPageContent;
