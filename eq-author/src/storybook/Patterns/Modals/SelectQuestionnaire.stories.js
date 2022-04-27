import React from "react";
import useModal from "hooks/useModal";

import QuestionnaireSelectModal from "components/modals/QuestionnaireSelectModal";
import QuestionnairesView from "components/ImportContentQuestionnairesView";
import * as Headings from "constants/table-headings";
import {
  Title,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

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
(questionArray = [...Array(10).keys()]).shift();

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

export const Default = (args) => {
  const [trigger, Modal] = useModal({
    ...args,
    component: QuestionnaireSelectModal,
  });

  return (
    <>
      <Modal>
        <QuestionnairesView {...args} />
      </Modal>
      <button onClick={trigger}>Trigger modal</button>
    </>
  );
};

Default.args = {
  questionnaires: questionnaires,
  enabledHeadings: enabledHeadings,
  canCreateQuestionnaire: false,
  onCreateQuestionnaire: nullFunction,
  onDeleteQuestionnaire: nullFunction,
  tableHeadings: enabledHeadings,
  onSortClick: nullFunction,
  onReverseClick: nullFunction,
  onQuestionnaireClick: nullFunction,
  padding: "small",
  questionnaireModal: true,
};

export default {
  title: "Patterns/Modals/Select a questionnaire",
  component: QuestionnaireSelectModal,
  argTypes: {
    questionnaireModal: {
      description: "Used when rendering question list inside a Modal",
      table: {
        type: {
          summary: "Bool",
          detail:
            "If True: will not render pagination and will render a scrollBar for the list inside the Modal. Will also render the selected questionnaire focus differently",
        },
        defaultValue: { summary: "undefined" },
      },
    },
    questionnaires: {
      description: "JSON Array of questionnaire objects",
      table: {
        type: {
          summary: "Array",
        },
      },
    },
    enabledHeadings: {
      description: "Which heading do you want to render?",
      table: {
        type: {
          summary: "Array",
          detail: "Include the relevant titles in the array",
        },
      },
    },
    canCreateQuestionnaire: {
      description: 'Show or hide the "Create questionnaire" button',
      table: {
        type: {
          summary: "Bool",
        },
      },
    },
    padding: {
      description: "Set to small for Modal",
      table: {
        type: {
          summary: "string",
          detail: "makes padding around search and filters smaller",
        },
      },
    },
  },

  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <p>
            This is a modal popup that contains a list of questions and is part
            of the ticket for adding import of questions into a questionnaire.
          </p>
          <p>
            We are essentially using the questionnaire home page as a component
            (QuestionnairesView) and piping it onto a custom modal
            (QuestionnaireSelectModal).
          </p>
          <p>
            Since we are using the same component as the home page but the
            design calls for a much stripped down version, we are using certain
            props to help in this stripping down!
          </p>
          <h3>Props to consider</h3>
          <p>These are listed in the table below with a basic description.</p>
          <p>
            click on the description down arrow for more details if available.
          </p>
          <ArgsTable story={PRIMARY_STORY} />
          <Primary />
          <Stories />
        </>
      ),
    },
  },
};
