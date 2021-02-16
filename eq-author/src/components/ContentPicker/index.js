import React from "react";
import PropTypes from "prop-types";

import ContentPicker from "components/ContentPicker/ContentPicker";

const sectionConfig = {
  id: "section",
  title: "Section",
  childKey: "pages",
};
const pageConfig = {
  id: "page",
  title: "Question",
  childKey: "answers",
};
const answerConfig = {
  id: "answer",
  title: "Answer",
};

export const AnswerContentPicker = (props) => {
  const { levels } = props;
  let config = [sectionConfig, pageConfig, answerConfig];
  if (!levels) {
    config = [sectionConfig, pageConfig, answerConfig];
  }
  if (levels === 2) {
    config = [pageConfig, answerConfig];
  }
  if (levels === 1) {
    config = [answerConfig];
  }
  return <ContentPicker {...props} config={config} />;
};

AnswerContentPicker.propTypes = {
  levels: PropTypes.number,
};

const metadataConfig = [
  {
    id: "metadata",
    title: "Metadata",
  },
];

export const MetadataContentPicker = (props) => (
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

export const QuestionContentPicker = (props) => (
  <ContentPicker {...props} config={questionConfig} />
);
