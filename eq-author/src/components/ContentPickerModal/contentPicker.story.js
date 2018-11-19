import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import ContentPickerModal from "components/ContentPickerModal";
import { ANSWER, METADATA } from "components/ContentPickerSelect/content-types";
import generateTestData from "tests/utils/generateMockPiping";

const answerData = generateTestData();

const metadataData = [
  { id: "1", displayName: "ru_name" },
  { id: "2", displayName: "collection_exercise_sid" },
  { id: "3", displayName: "language_code" }
];

storiesOf("ContentPicker", module)
  .add("With answers and metadata", () => {
    answerData[0].pages[0].answers = [];
    return (
      <ContentPickerModal
        answerData={answerData}
        metadataData={metadataData}
        contentTypes={[ANSWER, METADATA]}
        isOpen
        onClose={action("close")}
        onSubmit={action(`submit`)}
      />
    );
  })
  .add("With answers only", () => {
    answerData[0].pages[0].answers = [];
    return (
      <ContentPickerModal
        answerData={answerData}
        contentTypes={[ANSWER]}
        isOpen
        onClose={action("close")}
        onSubmit={action(`submit`)}
      />
    );
  })
  .add("With empty answers", () => {
    return (
      <ContentPickerModal
        answerData={[]}
        metadataData={metadataData}
        contentTypes={[ANSWER, METADATA]}
        isOpen
        onClose={action("close")}
        onSubmit={action(`submit`)}
      />
    );
  })
  .add("With empty metadata", () => {
    return (
      <ContentPickerModal
        answerData={answerData}
        metadataData={[]}
        contentTypes={[ANSWER, METADATA]}
        isOpen
        onClose={action("close")}
        onSubmit={action(`submit`)}
      />
    );
  });
