import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { flowRight } from "lodash";

import WrappingInput from "components/Forms/WrappingInput";
import RichTextEditor from "components/RichTextEditor";
import { Field, Label } from "components/Forms";

import withChangeUpdate from "enhancers/withChangeUpdate";

import MultipleFieldEditor from "./MultipleFieldEditor";
import withFetchAnswers from "./withFetchAnswers";

import pageFragment from "graphql/fragments/page.graphql";

const contentControls = {
  bold: true,
  emphasis: true,
  piping: true,
};

const StatelessAdditionalInfo = ({
  page,
  onChange,
  onUpdate,
  fetchAnswers,
  onChangeUpdate,
}) => (
  <MultipleFieldEditor label="Additional information">
    <Field>
      <Label htmlFor="additional-info-label">Label</Label>
      <WrappingInput
        id="additional-info-label"
        name="additionalInfoLabel"
        data-test="txt-question-additional-info-label"
        onChange={onChange}
        onBlur={onUpdate}
        value={page.additionalInfoLabel}
        bold
      />
    </Field>
    <RichTextEditor
      id="additional-info-content"
      name="additionalInfoContent"
      label="Content"
      value={page.additionalInfoContent}
      onUpdate={onChangeUpdate}
      controls={contentControls}
      multiline
      fetchAnswers={fetchAnswers}
      metadata={page.section.questionnaire.metadata}
      testSelector="txt-question-additional-info-content"
    />
  </MultipleFieldEditor>
);

StatelessAdditionalInfo.propTypes = {
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  fetchAnswers: PropTypes.func.isRequired,
  page: propType(pageFragment).isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

StatelessAdditionalInfo.fragments = {
  Page: pageFragment,
};

export default flowRight(
  withChangeUpdate,
  withFetchAnswers
)(StatelessAdditionalInfo);
