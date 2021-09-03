import React from "react";
import ItemSelectModal from "components/ItemSelectModal";
import ItemSelect, { Option } from "components/ItemSelectModal/ItemSelect";
import styled from "styled-components";

const Indent = styled(Option)`
  margin-left: 1em;
`;

const orderedOptions = [
  {
    id: "17e77262-4743-437c-b77b-6bbe9c9b40d9",
    title: "<p>Section One</p>",
    displayName: "Section One",
    questionnaire: {
      id: "2bcfacb4-e235-4310-8220-597f7fa92473",
      __typename: "Questionnaire",
    },
    validationErrorInfo: {
      id: "17e77262-4743-437c-b77b-6bbe9c9b40d9",
      totalCount: 0,
      __typename: "ValidationErrorInfo",
    },
    folders: [
      {
        id: "09ef7d3d-3208-49f7-aa22-7b7b45d8212a",
        enabled: false,
        alias: "",
        displayName: "Untitled folder",
        position: 0,
        pages: [
          {
            id: "f083b859-a4fe-4fd2-a8d3-64effcc2a28b",
            alias: null,
            title: "<p>Second Question</p>",
            position: 0,
            displayName: "Second Question",
            pageType: "QuestionPage",
            validationErrorInfo: {
              id: "f083b859-a4fe-4fd2-a8d3-64effcc2a28b",
              errors: [],
              totalCount: 0,
              __typename: "ValidationErrorInfo",
            },
            answers: [
              {
                id: "ddd7dbed-89be-4b8c-b929-7113451dad47",
                displayName: "Untitled answer",
                description: "",
                guidance: "",
                qCode: "",
                label: "",
                secondaryLabel: null,
                secondaryLabelDefault: null,
                type: "Checkbox",
                properties: { required: false },
                options: [
                  {
                    id: "5f7cbf5a-4d02-4943-81bd-215d4f2a4f4a",
                    displayName:
                      "Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom",
                    label:
                      "Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom ",
                    description: null,
                    value: null,
                    qCode: null,
                    __typename: "Option",
                  },
                  {
                    id: "c7a6f7d7-a6dc-4176-81a0-4ddbaada0747",
                    displayName:
                      "Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Two",
                    label:
                      "Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Two",
                    description: null,
                    value: null,
                    qCode: null,
                    __typename: "Option",
                  },
                ],
                mutuallyExclusiveOption: null,
                __typename: "MultipleChoiceAnswer",
                questionTitle: "<p>Second Question</p>",
                questionShortCode: null,
              },
              {
                id: "5c58cea9-bc6c-45d8-9a9a-fe33d6dc52ba",
                displayName: "Untitled answer",
                description: "",
                guidance: "",
                qCode: "",
                label: "",
                secondaryLabel: null,
                secondaryLabelDefault: null,
                type: "Radio",
                properties: { required: false },
                options: [
                  {
                    id: "c2fd626a-6c90-42d4-a652-bb541d53fecf",
                    displayName:
                      "Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing",
                    label:
                      "Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing ",
                    description: null,
                    value: null,
                    qCode: null,
                    __typename: "Option",
                  },
                  {
                    id: "9dcd5d6f-d23a-4224-a0af-922216a408c8",
                    displayName:
                      "Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing  Two",
                    label:
                      "Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing Testing  Two",
                    description: null,
                    value: null,
                    qCode: null,
                    __typename: "Option",
                  },
                ],
                mutuallyExclusiveOption: null,
                __typename: "MultipleChoiceAnswer",
              },
            ],
            confirmation: null,
            __typename: "QuestionPage",
          },
        ],
        validationErrorInfo: {
          id: "09ef7d3d-3208-49f7-aa22-7b7b45d8212a",
          totalCount: 0,
          __typename: "ValidationErrorInfo",
        },
        __typename: "Folder",
      },
      {
        id: "802e72b1-f970-4226-87d3-8a217a572179",
        enabled: false,
        alias: "",
        displayName: "Untitled folder",
        position: 1,
        pages: [
          {
            id: "1d3861b6-8176-4c74-afcf-75b436c574d4",
            alias: null,
            title: "<p>Comment</p>",
            position: 0,
            displayName: "Comment",
            pageType: "QuestionPage",
            validationErrorInfo: {
              id: "1d3861b6-8176-4c74-afcf-75b436c574d4",
              errors: [],
              totalCount: 0,
              __typename: "ValidationErrorInfo",
            },
            answers: [
              {
                id: "b7e5560e-5285-4bfe-ac8d-2ea99a7896d3",
                displayName: "Boom",
                description: "",
                guidance: "",
                qCode: "852963",
                label: "Boom",
                secondaryLabel: null,
                secondaryLabelDefault: "Untitled answer",
                type: "TextField",
                properties: { required: false },
                secondaryQCode: null,
                __typename: "BasicAnswer",
                questionTitle: "<p>Comment</p>",
                questionShortCode: null,
              },
            ],
            confirmation: null,
            __typename: "QuestionPage",
          },
        ],
        validationErrorInfo: {
          id: "802e72b1-f970-4226-87d3-8a217a572179",
          totalCount: 0,
          __typename: "ValidationErrorInfo",
        },
        __typename: "Folder",
      },
    ],
    __typename: "Section",
  },
  {
    id: "7175bae7-52cb-4ab4-a568-91fa2f293afb",
    title: "<p>Section Two</p>",
    displayName: "Section Two",
    questionnaire: {
      id: "2bcfacb4-e235-4310-8220-597f7fa92473",
      __typename: "Questionnaire",
    },
    validationErrorInfo: {
      id: "7175bae7-52cb-4ab4-a568-91fa2f293afb",
      totalCount: 0,
      __typename: "ValidationErrorInfo",
    },
    folders: [
      {
        id: "8de474fb-f250-4b3e-8124-00289c840861",
        enabled: false,
        alias: "",
        displayName: "Untitled folder",
        position: 0,
        pages: [
          {
            id: "da960ab1-bc83-4f3f-b77b-5edd627a07d9",
            alias: null,
            title: "<p>Third Question</p>",
            position: 0,
            displayName: "Third Question",
            pageType: "QuestionPage",
            validationErrorInfo: {
              id: "da960ab1-bc83-4f3f-b77b-5edd627a07d9",
              errors: [],
              totalCount: 0,
              __typename: "ValidationErrorInfo",
            },
            answers: [
              {
                id: "fc677b51-170f-452d-9b03-66800d24c497",
                displayName: "Third Answer",
                description: "",
                guidance: "",
                qCode: "12345654",
                label: "Third Answer",
                secondaryLabel: null,
                secondaryLabelDefault: "Untitled answer",
                type: "Number",
                properties: { required: false, decimals: 0 },
                secondaryQCode: null,
                __typename: "BasicAnswer",
                questionTitle: "<p>Third Question</p>",
                questionShortCode: null,
              },
            ],
            confirmation: null,
            __typename: "QuestionPage",
          },
        ],
        validationErrorInfo: {
          id: "8de474fb-f250-4b3e-8124-00289c840861",
          totalCount: 0,
          __typename: "ValidationErrorInfo",
        },
        __typename: "Folder",
      },
      {
        id: "aa9c8271-4891-45ab-83ea-e1d59e2b96d3",
        enabled: false,
        alias: "",
        displayName: "Untitled folder",
        position: 1,
        pages: [
          {
            id: "c87e129b-ae26-4908-8a3a-4035d2b7b277",
            alias: null,
            title: "<p>Fourth Question</p>",
            position: 0,
            displayName: "Fourth Question",
            pageType: "QuestionPage",
            validationErrorInfo: {
              id: "c87e129b-ae26-4908-8a3a-4035d2b7b277",
              errors: [],
              totalCount: 0,
              __typename: "ValidationErrorInfo",
            },
            answers: [
              {
                id: "31097990-c080-4749-824e-edddc0062210",
                displayName: "Four answer.",
                description: "",
                guidance: "",
                qCode: "169816138",
                label: "Four answer.",
                secondaryLabel: null,
                secondaryLabelDefault: "Untitled answer",
                type: "Number",
                properties: { required: false, decimals: 0 },
                secondaryQCode: null,
                __typename: "BasicAnswer",
                questionTitle: "<p>Fourth Question</p>",
                questionShortCode: null,
              },
            ],
            confirmation: null,
            __typename: "QuestionPage",
          },
        ],
        validationErrorInfo: {
          id: "aa9c8271-4891-45ab-83ea-e1d59e2b96d3",
          totalCount: 0,
          __typename: "ValidationErrorInfo",
        },
        __typename: "Folder",
      },
    ],
    __typename: "Section",
  },
  {
    id: "5273e10d-83e4-4782-b9b0-c670cf3883e8",
    title: "<p>Section Three</p>",
    displayName: "Section Three",
    questionnaire: {
      id: "2bcfacb4-e235-4310-8220-597f7fa92473",
      __typename: "Questionnaire",
    },
    validationErrorInfo: {
      id: "5273e10d-83e4-4782-b9b0-c670cf3883e8",
      totalCount: 0,
      __typename: "ValidationErrorInfo",
    },
    folders: [
      {
        id: "4b670c2e-08f2-4aa9-b14a-69de1b945194",
        enabled: false,
        alias: "",
        displayName: "Untitled folder",
        position: 0,
        pages: [
          {
            id: "a599741b-fce5-4430-ad09-635ce8d13c5d",
            alias: null,
            title: "<p>Fifth Question</p>",
            position: 0,
            displayName: "Fifth Question",
            pageType: "QuestionPage",
            validationErrorInfo: {
              id: "a599741b-fce5-4430-ad09-635ce8d13c5d",
              errors: [],
              totalCount: 0,
              __typename: "ValidationErrorInfo",
            },
            answers: [
              {
                id: "ded26a70-c296-4efe-b348-932c447f26f2",
                displayName: "Fifth Answer",
                description: "",
                guidance: "",
                qCode: "681354684",
                label: "Fifth Answer",
                secondaryLabel: null,
                secondaryLabelDefault: "Untitled answer",
                type: "Number",
                properties: { required: false, decimals: 0 },
                secondaryQCode: null,
                __typename: "BasicAnswer",
                questionTitle: "<p>Fifth Question</p>",
                questionShortCode: null,
              },
            ],
            confirmation: null,
            __typename: "QuestionPage",
          },
        ],
        validationErrorInfo: {
          id: "4b670c2e-08f2-4aa9-b14a-69de1b945194",
          totalCount: 0,
          __typename: "ValidationErrorInfo",
        },
        __typename: "Folder",
      },
      {
        id: "b85be2c5-06d2-456a-a4b1-fe824360abab",
        enabled: false,
        alias: "",
        displayName: "Untitled folder",
        position: 1,
        pages: [
          {
            id: "f3d5aa43-3d0f-4890-b6ec-76608e3d2b58",
            alias: null,
            title: "<p>Sixth Question</p>",
            position: 0,
            displayName: "Sixth Question",
            pageType: "QuestionPage",
            validationErrorInfo: {
              id: "f3d5aa43-3d0f-4890-b6ec-76608e3d2b58",
              errors: [],
              totalCount: 0,
              __typename: "ValidationErrorInfo",
            },
            answers: [
              {
                id: "d5857bac-618b-4190-aea5-280d636eb88e",
                displayName: "Sixth Answer",
                description: "",
                guidance: "",
                qCode: "3216816813",
                label: "Sixth Answer",
                secondaryLabel: null,
                secondaryLabelDefault: "Untitled answer",
                type: "Number",
                properties: { required: false, decimals: 0 },
                secondaryQCode: null,
                __typename: "BasicAnswer",
                questionTitle: "<p>Sixth Question</p>",
                questionShortCode: null,
              },
            ],
            confirmation: null,
            __typename: "QuestionPage",
          },
        ],
        validationErrorInfo: {
          id: "b85be2c5-06d2-456a-a4b1-fe824360abab",
          totalCount: 0,
          __typename: "ValidationErrorInfo",
        },
        __typename: "Folder",
      },
    ],
    __typename: "Section",
  },
  {
    id: "fc890a50-597c-429f-999b-a806e3755e16",
    title: "<p>Section Four</p>",
    displayName: "Section Four",
    questionnaire: {
      id: "2bcfacb4-e235-4310-8220-597f7fa92473",
      __typename: "Questionnaire",
    },
    validationErrorInfo: {
      id: "fc890a50-597c-429f-999b-a806e3755e16",
      totalCount: 0,
      __typename: "ValidationErrorInfo",
    },
    folders: [
      {
        id: "b51e584d-9c21-4cd9-b61f-39d05e785225",
        enabled: false,
        alias: "",
        displayName: "Untitled folder",
        position: 0,
        pages: [
          {
            id: "15b5543d-7799-4902-a05f-18bd6807b369",
            alias: null,
            title: "<p>First Question</p>",
            position: 0,
            displayName: "First Question",
            pageType: "QuestionPage",
            validationErrorInfo: {
              id: "15b5543d-7799-4902-a05f-18bd6807b369",
              errors: [],
              totalCount: 0,
              __typename: "ValidationErrorInfo",
            },
            answers: [
              {
                id: "b5823d87-1908-4a3e-9bdd-c036c220f833",
                displayName: "First Answer",
                description: "",
                guidance: "",
                qCode: "123",
                label: "First Answer",
                secondaryLabel: null,
                secondaryLabelDefault: "Untitled answer",
                type: "Number",
                properties: { required: false, decimals: 0 },
                secondaryQCode: null,
                __typename: "BasicAnswer",
                questionTitle: "<p>First Question</p>",
                questionShortCode: null,
              },
            ],
            confirmation: null,
            __typename: "QuestionPage",
          },
        ],
        validationErrorInfo: {
          id: "b51e584d-9c21-4cd9-b61f-39d05e785225",
          totalCount: 0,
          __typename: "ValidationErrorInfo",
        },
        __typename: "Folder",
      },
      {
        id: "e9405142-0a8d-4de6-8bc4-8caea8de83f4",
        enabled: false,
        alias: "",
        displayName: "Untitled folder",
        position: 1,
        pages: [
          {
            id: "32c9b313-9e49-4ce0-ae45-f9f3db6650f7",
            alias: null,
            title: "<p>Seventh Question</p>",
            position: 0,
            displayName: "Seventh Question",
            pageType: "QuestionPage",
            validationErrorInfo: {
              id: "32c9b313-9e49-4ce0-ae45-f9f3db6650f7",
              errors: [],
              totalCount: 0,
              __typename: "ValidationErrorInfo",
            },
            answers: [
              {
                id: "4a14bf05-4300-450b-9935-8534586fb06d",
                displayName: "Seventh Answer",
                description: "",
                guidance: "",
                qCode: "32132065",
                label: "Seventh Answer",
                secondaryLabel: null,
                secondaryLabelDefault: "Untitled answer",
                type: "Number",
                properties: { required: false, decimals: 0 },
                secondaryQCode: null,
                __typename: "BasicAnswer",
                questionTitle: "<p>Seventh Question</p>",
                questionShortCode: null,
              },
            ],
            confirmation: null,
            __typename: "QuestionPage",
          },
        ],
        validationErrorInfo: {
          id: "e9405142-0a8d-4de6-8bc4-8caea8de83f4",
          totalCount: 0,
          __typename: "ValidationErrorInfo",
        },
        __typename: "Folder",
      },
      {
        id: "429e0edb-135c-4136-8f1e-2f21bf281921",
        enabled: false,
        alias: "",
        displayName: "Untitled folder",
        position: 2,
        pages: [
          {
            id: "63531ba7-af99-4823-918a-b735087a7792",
            alias: null,
            title: "<p>Eighth Question</p>",
            position: 0,
            displayName: "Eighth Question",
            pageType: "QuestionPage",
            validationErrorInfo: {
              id: "63531ba7-af99-4823-918a-b735087a7792",
              errors: [],
              totalCount: 0,
              __typename: "ValidationErrorInfo",
            },
            answers: [
              {
                id: "3c2f69ad-c91c-4a8b-b027-227ba41f1947",
                displayName: "Eighth Answer",
                description: "",
                guidance: "",
                qCode: "321654",
                label: "Eighth Answer",
                secondaryLabel: null,
                secondaryLabelDefault: "Untitled answer",
                type: "Number",
                properties: { required: false, decimals: 0 },
                secondaryQCode: null,
                __typename: "BasicAnswer",
                questionTitle: "<p>Eighth Question</p>",
                questionShortCode: null,
              },
            ],
            confirmation: null,
            __typename: "QuestionPage",
          },
        ],
        validationErrorInfo: {
          id: "429e0edb-135c-4136-8f1e-2f21bf281921",
          totalCount: 0,
          __typename: "ValidationErrorInfo",
        },
        __typename: "Folder",
      },
    ],
    __typename: "Section",
  },
];

const Default = (args) => {
  return (
    <ItemSelectModal isOpen {...args}>
      <ItemSelect data-test="testOne" name={args.title.toLowerCase()} value="1">
        {orderedOptions.map(({ displayName, parentEnabled }, i) => (
          <Indent
            data-test="options"
            key={i}
            value={String(i)}
            indent={parentEnabled ? parentEnabled.toString() : undefined}
          >
            {displayName}
          </Indent>
        ))}
      </ItemSelect>
    </ItemSelectModal>
  );
};

export const Modal = Default.bind({});
Modal.args = {
  title: "Move Question",
};

export default {
  title: "Patterns/Modals/ItemSelectModal",
  component: ItemSelectModal,
  argTypes: {
    onConfirm: { action: "Confirmed" },
    onCancel: { action: "Cancelled" },
    primaryText: {
      description: "The string for the confirm text.",
      defaultValue: "Select",
    },
    secondaryText: {
      description: "The string for the cancel text.",
      defaultValue: "Cancel",
    },
    title: {
      description: "The string for the title text.",
      defaultValue: "Item Select Modal",
    },
    children: {
      defaultValue: "Section One",
    },
  },
};
