import React, { useState } from "react";

import QuestionPicker from "components/ContentPickerv2/QuestionPicker/";

export default {
  title: "Patterns/Importing content/Select questions",
  component: QuestionPicker,
};

// https://stackoverflow.com/questions/56248544/how-to-show-unordered-list-within-window-alert/56248648
function createUnorderedList(list, bulletChar) {
  var result = "";
  for (var i = 0; i < list.length; ++i) {
    result += bulletChar + " " + list[i] + "\n";
  }
  return result;
}

const Template = ({ isOpen, onClose, ...rest }) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  return (
    <>
      <button onClick={() => setModalIsOpen(true)}>Open modal</button>
      <QuestionPicker
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        warningPanel="You cannot import folders but you can import any questions they contain."
        {...rest}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: "Select the question(s) to import",
  isOpen: false,
  showSearch: true,
  hideQuestionType: true,
  onSubmit: (selectedAnswers) =>
    alert(
      "You have selected the following questions:\n\n" +
        createUnorderedList(
          selectedAnswers.map(({ id, displayName }) => displayName),
          "•"
        )
    ),
  startingSelectedAnswers: [],
  data: [
    {
      id: "c8a21a5a-bd66-4aa7-9e8f-2e96c53640c2",
      title: "",
      displayName: "Section one",
      questionnaire: {
        id: "77eaf38c-e2d5-4c6c-88f5-5ece3bc5d5f6",
      },
      validationErrorInfo: {
        id: "c8a21a5a-bd66-4aa7-9e8f-2e96c53640c2",
        totalCount: 0,
      },
      folders: [
        {
          id: "cbec8e72-b828-467a-8c54-798832a57706",
          enabled: false,
          alias: "",
          displayName: "Untitled folder",
          position: 1,
          pages: [
            {
              id: "375a9077-f2e6-4262-99b9-8cdd6022c869",
              alias: null,
              title:
                "<p>Please tell us the number of each pet type that you have.</p>",
              position: 0,
              displayName:
                "Please tell us the number of each pet type that you have.",
              pageType: "QuestionPage",
              validationErrorInfo: {
                id: "375a9077-f2e6-4262-99b9-8cdd6022c869",
                errors: [],
                totalCount: 0,
              },
              answers: [
                {
                  id: "00312827-55e2-4a1f-bd14-1f170d356785",
                  displayName: "How many dogs do you have?",
                  description: "",
                  guidance: "",
                  qCode: "",
                  label: "How many dogs do you have?",
                  secondaryLabel: null,
                  secondaryLabelDefault: "Untitled answer",
                  type: "Number",
                  properties: {
                    required: false,
                    decimals: 0,
                  },
                  secondaryQCode: null,
                  questionTitle:
                    "<p>Please tell us the number of each pet type that you have.</p>",
                  questionShortCode: null,
                },
                {
                  id: "949fc2d9-a632-4f01-8aa7-346f2f374e5f",
                  displayName: "How many cats do you have?",
                  description: "",
                  guidance: "",
                  qCode: "",
                  label: "How many cats do you have?",
                  secondaryLabel: null,
                  secondaryLabelDefault: "Untitled answer",
                  type: "Number",
                  properties: {
                    required: false,
                    decimals: 0,
                  },
                  secondaryQCode: null,
                },
                {
                  id: "91c904d1-6661-4c93-a6e8-86a0d7b3c199",
                  displayName: "How many hamsters do you have?",
                  description: "",
                  guidance: "",
                  qCode: "",
                  label: "How many hamsters do you have?",
                  secondaryLabel: null,
                  secondaryLabelDefault: "Untitled answer",
                  type: "Number",
                  properties: {
                    required: false,
                    decimals: 0,
                  },
                  secondaryQCode: null,
                },
                {
                  id: "061d3f93-bc73-4a7a-8f0b-49875adee108",
                  displayName: "How many birds do you have?",
                  description: "",
                  guidance: "",
                  qCode: "",
                  label: "How many birds do you have?",
                  secondaryLabel: null,
                  secondaryLabelDefault: "Untitled answer",
                  type: "Number",
                  properties: {
                    required: false,
                    decimals: 0,
                  },
                  secondaryQCode: null,
                },
                {
                  id: "8473eede-7773-4390-b06c-20ac2e85b357",
                  displayName: "How many other pets do you have?",
                  description: "",
                  guidance: "",
                  qCode: "",
                  label: "How many other pets do you have?",
                  secondaryLabel: null,
                  secondaryLabelDefault: "Untitled answer",
                  type: "Number",
                  properties: {
                    required: false,
                    decimals: 0,
                  },
                  secondaryQCode: null,
                },
              ],
              confirmation: null,
            },
          ],
          validationErrorInfo: {
            id: "cbec8e72-b828-467a-8c54-798832a57706",
            totalCount: 0,
          },
        },
      ],
    },
  ],
};
