import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import { get, flowRight, some, filter } from "lodash";
import { TransitionGroup } from "react-transition-group";

import WrappingInput from "components/Forms/WrappingInput";
import RichTextEditor from "components/RichTextEditor";
import { Field, Label } from "components/Forms";

import withChangeUpdate from "enhancers/withChangeUpdate";
import withValidationError from "enhancers/withValidationError";
import { richTextEditorErrors } from "constants/validationMessages";

import MultipleFieldEditor from "./MultipleFieldEditor";
import AnswerTransition from "./AnswersEditor/AnswerTransition";
import focusOnElement from "utils/focusOnElement";
import focusOnNode from "utils/focusOnNode";

import pageFragment from "graphql/fragments/page.graphql";

import { colors } from "constants/theme";

const titleControls = {
  emphasis: true,
  piping: true,
};

const descriptionControls = {
  emphasis: true,
  piping: true,
};
const definitionControls = {
  list: true,
  emphasis: true,
  bold: true,
};

const guidanceControls = {
  bold: true,
  list: true,
};

const Paragraph = styled.p`
  margin: 0 0 1em;
  background: ${colors.lighterGrey};
  padding: 0.5em;
  border-left: 5px solid ${colors.lightGrey};
`;

const {
  QUESTION_TITLE_NOT_ENTERED,
  PIPING_TITLE_MOVED,
  PIPING_TITLE_DELETED,
} = richTextEditorErrors;

/* eslint-disable react/prop-types */
const ERROR_SITUATIONS = [
  {
    condition: errors =>
      some(errors, {
        errorCode: QUESTION_TITLE_NOT_ENTERED.errorCode,
      }),
    message: () => QUESTION_TITLE_NOT_ENTERED.message,
  },
  {
    condition: errors =>
      some(errors, {
        errorCode: PIPING_TITLE_MOVED.errorCode,
      }),
    message: () => PIPING_TITLE_MOVED.message,
  },
  {
    condition: errors =>
      some(errors, {
        errorCode: PIPING_TITLE_DELETED.errorCode,
      }),
    message: () => PIPING_TITLE_DELETED.message,
  },
];

export class StatelessMetaEditor extends React.Component {
  description = React.createRef();
  guidance = React.createRef();

  ErrorMsg = titleErrors => {
    for (let i = 0; i < ERROR_SITUATIONS.length; ++i) {
      const { condition, message } = ERROR_SITUATIONS[i];
      if (condition(titleErrors)) {
        return message(titleErrors);
      }
    }
  };

  render() {
    const titleErrors = filter(this.props.page.validationErrorInfo.errors, {
      field: "title",
    });
    const ErrorMsg = this.ErrorMsg(titleErrors);
    const {
      page,
      onChange,
      onUpdate,
      onChangeUpdate,
      fetchAnswers,
    } = this.props;
    return (
      <div>
        <RichTextEditor
          id="question-title"
          name="title"
          label="Question"
          placeholder=""
          value={page.title}
          onUpdate={onChangeUpdate}
          controls={titleControls}
          size="large"
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          testSelector="txt-question-title"
          autoFocus={!page.title}
          errorValidationMsg={ErrorMsg}
        />

        <TransitionGroup>
          {page.descriptionEnabled && (
            <AnswerTransition
              key="question-description"
              onEntered={() => focusOnNode(this.description)}
            >
              <RichTextEditor
                ref={this.description}
                id="question-description"
                name="description"
                label="Question description"
                multiline="true"
                value={page.description}
                onUpdate={onChangeUpdate}
                controls={descriptionControls}
                fetchAnswers={fetchAnswers}
                metadata={get(page, "section.questionnaire.metadata", [])}
                testSelector="txt-question-description"
              />
            </AnswerTransition>
          )}
          {page.definitionEnabled && (
            <AnswerTransition
              key="definition"
              onEntered={() => focusOnElement("definition-label")}
            >
              <MultipleFieldEditor id="definition" label="Question definition">
                <Paragraph>
                  Only to be used to define word(s) or acronym(s) within the
                  question.
                </Paragraph>
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
                  />
                </Field>
                <RichTextEditor
                  id="definition-content"
                  name="definitionContent"
                  label="Content"
                  multiline="true"
                  value={page.definitionContent}
                  onUpdate={onChangeUpdate}
                  controls={definitionControls}
                  fetchAnswers={fetchAnswers}
                  metadata={page.section.questionnaire.metadata}
                  testSelector="txt-question-definition-content"
                />
              </MultipleFieldEditor>
            </AnswerTransition>
          )}

          {page.guidanceEnabled && (
            <AnswerTransition
              key="question-guidance"
              onEntered={() => focusOnNode(this.guidance)}
            >
              <RichTextEditor
                ref={this.guidance}
                id="question-guidance"
                name="guidance"
                label="Include/exclude"
                multiline="true"
                value={page.guidance}
                onUpdate={onChangeUpdate}
                controls={guidanceControls}
                fetchAnswers={fetchAnswers}
                metadata={get(page, "section.questionnaire.metadata", [])}
                testSelector="txt-question-guidance"
              />
            </AnswerTransition>
          )}
        </TransitionGroup>
      </div>
    );
  }
}

StatelessMetaEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  fetchAnswers: PropTypes.func.isRequired,
  page: propType(pageFragment).isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

StatelessMetaEditor.fragments = {
  Page: pageFragment,
};

export default flowRight(
  withValidationError("page"),
  withChangeUpdate
)(StatelessMetaEditor);
