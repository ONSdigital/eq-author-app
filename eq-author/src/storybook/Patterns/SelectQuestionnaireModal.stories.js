import React from "react";

import QuestionnaireSelectModal from "components/modals/QuestionnaireSelectModal";
import Modal from "components/modals/Modal";
import QuestionnairesView from "../../components/QuestionnairesView";
import * as Headings from "constants/table-headings";

export default {
  title: "Patterns/Select Questionnaire Modal",
  component: Modal,
  argTypes: {
    onConfirm: { action: "Confirmed" },
    onCancel: { action: "Cancelled" },
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
