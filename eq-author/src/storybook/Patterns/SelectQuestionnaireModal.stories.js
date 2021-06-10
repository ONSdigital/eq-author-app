import React from "react";

import QuestionnaireSelectModal from "components/modals/QuestionnaireSelectModal";
import Modal from "components/modals/Modal";
import QuestionnairesView from "../../components/QuestionnairesView";
import * as Headings from "constants/table-headings";
import {
  Title,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

export default {
  title: "Patterns/Select Questionnaire Modal",
  component: Modal,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <p>
            This is a modal popup that contains a list of questions and is part of the ticket for adding import of 
          </p>
          <p>
            The prototype was built using the same components that comprise the
            existing navigaion bar.
          </p>
          <h3>Accessibility features</h3>
          <p>
            The library comes with out-of-the-box accessibility support,
            including full keyboard support and configurable screen reader
            support.
          </p>
          <p>
            The cursor also changes to supply feedback to the user on what can
            be done. For instance, a flat hand when hovering over a draggable
            element, a clenched fist when dragging an element, and a pointed
            finger at a non-draggable link.
          </p>
          <p>To use the keyboard support:</p>
          <ol>
            <li>
              Tab through the page to focus on the right arrow symbol beside the
              section title
            </li>
            <li>Press enter right arrow key - the collapsible will open</li>
            <li>Carry on tabbing through and focus on a page</li>
            <li>Press the space bar - this will select a page to grab</li>
            <li>Using the arrow keys, move the page up and down</li>
            <li>
              Press the space bar again - this will drop the page into the new
              position
            </li>
          </ol>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const user = {
  id: "3",
  name: "Foo",
  email: "foo@bar.com",
  displayName: "Foo",
};

const buildQuestionnaire = (index) => ({
  id: `questionnaire${index}`,
  displayName: `Questionnaire ${index}`,
  title: `Questionnaire ${index} Title`,
  shortTitle: "",
  createdAt: `2019-05-${30 - index}T12:36:50.984Z`,
  updatedAt: `2019-05-${30 - index}T12:36:50.984Z`,
  createdBy: user,
  permission: "Write",
  publishStatus: "Unpublished",
  starred: false,
  locked: false,
});

let questionArray;
(questionArray = [...Array(11).keys()]).shift();

const questionnaires = questionArray.map((index) => buildQuestionnaire(index));

const enabledHeadings = [
  Headings.TITLE,
  Headings.OWNER,
  Headings.CREATED,
  Headings.MODIFIED,
];

const nullFunction = () => {
  return null;
};

const Template = (args) => (
  <QuestionnaireSelectModal isOpen>
    <QuestionnairesView {...args} />
  </QuestionnaireSelectModal>
);

export const MainModal = Template.bind({});
MainModal.args = {
  questionnaires: questionnaires,
  enabledHeadings: enabledHeadings,
  canCreateQuestionnaire: false,
  tableHeadings: enabledHeadings,
  onSortClick: nullFunction,
  onReverseClick: nullFunction,
  onRowClick: nullFunction,
  padding: "small",
  questionnaireModal: true,
};
