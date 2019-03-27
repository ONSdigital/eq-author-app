import React from "react";
import ContentPicker from "components/ContentPicker/ContentPicker";
import GroupContentPicker from "components/ContentPicker/GroupContentPicker";

const config = [
  {
    id: "section",
    title: "Section",
    childKey: "pages",
  },
  {
    id: "page",
    title: "Question",
    childKey: "answers",
  },
  {
    id: "answer",
    title: "Answer",
  },
];

export const AnswerContentPicker = props => (
  <ContentPicker {...props} config={config} />
);

const metadataConfig = [
  {
    id: "metadata",
    title: "Metadata",
  },
];

export const MetadataContentPicker = props => (
  <ContentPicker {...props} config={metadataConfig} />
);

const questionConfig = [
  {
    id: "section",
    title: "Section",
    childKey: "pages",
  },
  {
    id: "page",
    title: "Question",
  },
];

export const QuestionContentPicker = props => (
  <ContentPicker {...props} config={questionConfig} />
);

const routingDestinationConfig = [
  {
    id: "Page",
    title: "Other pages in this section",
    groupKey: "pages",
    expandable: true,
    destination: {
      absoluteDestination: {
        destinationId: null,
        destinationType: "Page",
      },
    },
  },
  {
    id: "Section",
    title: "Other sections",
    groupKey: "sections",
    expandable: true,
    destination: {
      absoluteDestination: {
        destinationId: null,
        destinationType: "Section",
      },
    },
  },
  {
    id: "EndOfQuestionnaire",
    title: "End of questionnaire",
    groupKey: "logicalDestinations",
    expandable: false,
    type: "RoutingLogicalDestination",
    destination: {
      logical: "EndOfQuestionnaire",
    },
  },
];

export const RoutingDestinationContentPicker = props => (
  <GroupContentPicker {...props} config={routingDestinationConfig} />
);
