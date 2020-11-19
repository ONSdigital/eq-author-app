import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { flowRight } from "lodash";
import { TransitionGroup } from "react-transition-group";

import WrappingInput from "components/Forms/WrappingInput";
import RichTextEditor from "components/RichTextEditor";
import { Field, Label } from "components/Forms";

import withChangeUpdate from "enhancers/withChangeUpdate";

import AnswerTransition from "./AnswersEditor/AnswerTransition";

import MultipleFieldEditor from "./MultipleFieldEditor";
import focusOnElement from "utils/focusOnElement";
import pageFragment from "graphql/fragments/page.graphql";

import { getErrorByField } from "./validationUtils.js";

const contentControls = {
  bold: true,
  emphasis: true,
  list: true,
  link: true,
};

export const StatelessAdditionalInfo = ({
  page,
  onChange,
  onUpdate,
  fetchAnswers,
  onChangeUpdate,
  page: {
    validationErrorInfo: { errors },
  },
}) => (
  <TransitionGroup>
    {page.additionalInfoEnabled && (
      <AnswerTransition
        key="additional-info"
        onEntered={() => focusOnElement("additional-info-label")}
      >
        <MultipleFieldEditor
          id="additional-info"
          label="Additional information"
        >
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
              errorValidationMsg={getErrorByField(
                "additionalInfoLabel",
                errors
              )}
            />
          </Field>
          <RichTextEditor
            id="additional-info-content"
            name="additionalInfoContent"
            label="Content"
            multiline
            value={page.additionalInfoContent}
            onUpdate={onChangeUpdate}
            controls={contentControls}
            fetchAnswers={fetchAnswers}
            metadata={page.section.questionnaire.metadata}
            testSelector="txt-question-additional-info-content"
            errorValidationMsg={getErrorByField(
              "additionalInfoContent",
              errors
            )}
          />
        </MultipleFieldEditor>
      </AnswerTransition>
    )}
  </TransitionGroup>
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

export default flowRight(withChangeUpdate)(StatelessAdditionalInfo);
