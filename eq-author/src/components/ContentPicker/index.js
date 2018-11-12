import React from "react";
import ContentPicker from "./ContentPicker";

const config = [
  {
    id: "section",
    title: "Section",
    childKey: "pages"
  },
  {
    id: "page",
    title: "Question",
    childKey: "answers"
  },
  {
    id: "answer",
    title: "Answer"
  }
];

export const AnswerContentPicker = props => (
  <ContentPicker {...props} config={config} />
);

const metadataConfig = [
  {
    id: "metadata",
    title: "Metadata"
  }
];

export const MetadataContentPicker = props => (
  <ContentPicker {...props} config={metadataConfig} />
);
