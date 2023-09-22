import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { get, flowRight } from "lodash";
import { useMutation } from "@apollo/react-hooks";

import { TransitionGroup } from "react-transition-group";

import WrappingInput from "components/Forms/WrappingInput";
import RichTextEditor from "components/RichTextEditor";
import { Field, Label } from "components/Forms";

import focusOnNode from "utils/focusOnNode";

import withChangeUpdate from "enhancers/withChangeUpdate";

import AnswerTransition from "../AnswersEditor/AnswerTransition";

import focusOnElement from "utils/focusOnElement";
import pageFragment from "graphql/fragments/questionPage.graphql";

import UPDATE_PAGE_MUTATION from "graphql/updatePage.graphql";
import {
  getErrorByField,
  getMultipleErrorsByField,
} from "../validationUtils.js";

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

const Wrapper = styled.div`
  margin: 0 1.7em 1em 0.96em;
`;

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
}) => {
  const [updatePage] = useMutation(UPDATE_PAGE_MUTATION);

  const handlePageUpdate = ({ name, value }) => {
    const { id } = page;
    updatePage({ variables: { input: { id, [name]: value } } });
  };

  return (
    <TransitionGroup>
      {page.descriptionEnabled && option === "description" ? (
        <AnswerTransition
          key="question-description"
          onEntered={() => focusOnNode(page.description)}
        >
          <Wrapper>
            <RichTextEditor
              id="question-description"
              name="description"
              multiline
              value={page.description}
              onUpdate={
                page.pageType === "ListCollectorAddItemPage"
                  ? handlePageUpdate
                  : onChangeUpdate
              }
              controls={descriptionControls}
              fetchAnswers={fetchAnswers}
              metadata={get(page, "section.questionnaire.metadata", [])}
              testSelector="txt-question-description"
              listId={page.section?.repeatingSectionListId ?? null}
              errorValidationMsg={getMultipleErrorsByField(
                "description",
                page.validationErrorInfo.errors
              )}
            />
          </Wrapper>
        </AnswerTransition>
      ) : null}

      {page.definitionEnabled && option === "definition" ? (
        <AnswerTransition
          key="definition"
          onEntered={() => focusOnElement("definition-label")}
        >
          <Wrapper>
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
              onUpdate={
                page.pageType === "ListCollectorAddItemPage"
                  ? handlePageUpdate
                  : onChangeUpdate
              }
              controls={definitionControls}
              fetchAnswers={fetchAnswers}
              metadata={page.section.questionnaire.metadata}
              testSelector="txt-question-definition-content"
              errorValidationMsg={errorMsg("definitionContent", page)}
            />
          </Wrapper>
        </AnswerTransition>
      ) : null}

      {page.guidanceEnabled && option === "guidance" ? (
        <AnswerTransition
          key="question-guidance"
          onEntered={() => focusOnNode(page.guidance)}
        >
          <Wrapper>
            <RichTextEditor
              id="question-guidance"
              name="guidance"
              multiline
              value={page.guidance}
              onUpdate={onUpdate}
              controls={guidanceControls}
              fetchAnswers={fetchAnswers}
              metadata={get(page, "section.questionnaire.metadata", [])}
              testSelector="txt-question-guidance"
              errorValidationMsg={errorMsg("guidance", page)}
            />
          </Wrapper>
        </AnswerTransition>
      ) : null}

      {page.additionalInfoEnabled && option === "additionalInfo" ? (
        <AnswerTransition
          key="additional-info"
          onEntered={() => focusOnElement("additional-info-label")}
        >
          <Wrapper>
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
              onUpdate={
                page.pageType === "ListCollectorAddItemPage"
                  ? handlePageUpdate
                  : onChangeUpdate
              }
              controls={contentControls}
              fetchAnswers={fetchAnswers}
              metadata={page.section.questionnaire.metadata}
              testSelector="txt-question-additional-info-content"
              errorValidationMsg={getErrorByField(
                "additionalInfoContent",
                errors
              )}
            />
          </Wrapper>
        </AnswerTransition>
      ) : null}
    </TransitionGroup>
  );
};

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
