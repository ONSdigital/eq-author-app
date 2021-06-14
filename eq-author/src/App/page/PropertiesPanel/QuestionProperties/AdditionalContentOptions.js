import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { get, flowRight } from "lodash";
import { TransitionGroup } from "react-transition-group";

import WrappingInput from "components/Forms/WrappingInput";
import RichTextEditor from "components/RichTextEditor";
import { Field, Label } from "components/Forms";

import focusOnNode from "utils/focusOnNode";

import withChangeUpdate from "enhancers/withChangeUpdate";

import AnswerTransition from "../../Design/QuestionPageEditor/AnswersEditor/AnswerTransition";

import MultipleFieldEditor from "../../Design/QuestionPageEditor/MultipleFieldEditor";
import focusOnElement from "utils/focusOnElement";
import pageFragment from "graphql/fragments/page.graphql";

import { getErrorByField } from "../../Design/QuestionPageEditor/validationUtils.js";

const contentControls = {
  bold: true,
  emphasis: true,
  list: true,
  link: true,
};

const descriptionControls = {
  emphasis: true,
  piping: true,
  link: true,
};

const definitionControls = {
  list: true,
  emphasis: true,
  bold: true,
  link: true,
};

const guidanceControls = {
  bold: true,
  list: true,
  link: true,
};

const errorMsg = (field, page) =>
  getErrorByField(field, page.validationErrorInfo.errors);

export const StatelessAdditionalInfo = ({
  page,
  onChange,
  onUpdate,
  fetchAnswers,
  onChangeUpdate,
  page: {
    validationErrorInfo: { errors },
  },
  option,
}) => (
  <TransitionGroup>
    {page.additionalInfoEnabled && option === "additionalInfo" ? (
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
    ) : null}

    {page.descriptionEnabled && option === "description" ? (
      <AnswerTransition
        key="question-description"
        onEntered={() => focusOnNode(page.description)}
      >
        <RichTextEditor
          id="question-description"
          name="description"
          label="Question description"
          multiline
          value={page.description}
          onUpdate={onChangeUpdate}
          controls={descriptionControls}
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          testSelector="txt-question-description"
          errorValidationMsg={errorMsg("description", page)}
        />
      </AnswerTransition>
    ) : null}

    {page.definitionEnabled && option === "definition" ? (
      <AnswerTransition
        key="definition"
        onEntered={() => focusOnElement("definition-label")}
      >
        <MultipleFieldEditor id="definition" label="Question definition">
          <Field>
            <Label htmlFor="definition-label">Label</Label>
            <WrappingInput
              id="definition-label"
              name="definitionLabel"
              data-test="txt-question-definition-label"
              onChange={onChange}
              onBlur={onUpdate}
              value={page.definitionLabel}
              bold
              errorValidationMsg={errorMsg("definitionLabel", page)}
            />
          </Field>
          <RichTextEditor
            id="definition-content"
            name="definitionContent"
            label="Content"
            multiline
            value={page.definitionContent}
            onUpdate={onChangeUpdate}
            controls={definitionControls}
            fetchAnswers={fetchAnswers}
            metadata={page.section.questionnaire.metadata}
            testSelector="txt-question-definition-content"
            errorValidationMsg={errorMsg("definitionContent", page)}
          />
        </MultipleFieldEditor>
      </AnswerTransition>
    ) : null}

    {page.guidanceEnabled && option === "guidance" ? (
      <TransitionGroup>
        <AnswerTransition
          key="question-guidance"
          onEntered={() => focusOnNode(page.guidance)}
        >
          <RichTextEditor
            id="question-guidance"
            name="guidance"
            label="Include/exclude"
            multiline
            value={page.guidance}
            onUpdate={onChangeUpdate}
            controls={guidanceControls}
            fetchAnswers={fetchAnswers}
            metadata={get(page, "section.questionnaire.metadata", [])}
            testSelector="txt-question-guidance"
            errorValidationMsg={errorMsg("guidance", page)}
          />
        </AnswerTransition>
      </TransitionGroup>
    ) : null}
  </TransitionGroup>
);

StatelessAdditionalInfo.propTypes = {
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  fetchAnswers: PropTypes.func.isRequired,
  page: propType(pageFragment).isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  option: PropTypes.string.isRequired,
};

StatelessAdditionalInfo.fragments = {
  Page: pageFragment,
};

export default flowRight(withChangeUpdate)(StatelessAdditionalInfo);
