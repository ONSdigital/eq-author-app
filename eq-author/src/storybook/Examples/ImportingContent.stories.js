import React from "react";
import ImportingContent from "App/importingContent";

import {
  Title,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

//setup

const user = {
  id: "3",
  name: "Foo",
  email: "foo@bar.com",
  displayName: "Foo",
};

const buildQuestionnaire = (index) => ({
  id: `questionnaire${index}`,
  displayName: `Questionnaire about Thing ${index}`,
  title: `Questionnaire about Thing ${index}`,
  shortTitle: `Thing ${index}`,
  createdAt: `2019-05-${30 - index}T12:36:50.984Z`,
  updatedAt: `2019-05-${30 - index}T12:36:50.984Z`,
  createdBy: user,
  permission: "Write",
  publishStatus: "Unpublished",
  starred: false,
  locked: false,
});

let questionArray;
questionArray = [...Array(2).keys()];

const questionnaires = questionArray.map((index) =>
  buildQuestionnaire(index + 1)
);

export default {
  title: "Examples/Importing content",
  component: ImportingContent,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

export const Default = (args) => <ImportingContent {...args} />;
Default.args = {
  questionnaires,
  active: true,
};
