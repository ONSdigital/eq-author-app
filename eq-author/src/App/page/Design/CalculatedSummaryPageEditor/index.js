import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { get, flowRight } from "lodash";
import styled from "styled-components";
import gql from "graphql-tag";

import { colors } from "constants/theme";
import RichTextEditor from "components/RichTextEditor";
import withChangeUpdate from "enhancers/withChangeUpdate";
import withUpdateCalculatedSummaryPage from "./withUpdateCalculatedSummaryPage";
import withEntityEditor from "components/withEntityEditor";
import withValidationError from "enhancers/withValidationError";
import PageHeader from "../PageHeader";

import withPropRenamed from "enhancers/withPropRenamed";
import AnswerSelector from "./AnswerSelector";
import {
  ANSWER,
  METADATA,
  VARIABLES,
} from "components/ContentPickerSelect/content-types";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";

const titleControls = {
  emphasis: true,
  piping: true,
};

const PageSegment = styled.div`
  padding: 0 2em;
`;

const SelectorTitle = styled.h2`
  font-size: 1em;
  color: ${colors.darkGrey};
  margin: 0 0 0.4em;
`;

export const CalculatedSummaryPageEditor = props => {
  const {
    page,
    fetchAnswers,
    onUpdate,
    onChange,
    onChangeUpdate,
    onUpdateCalculatedSummaryPage,
    getValidationError,
  } = props;
  return (
    <div data-test="calculated-summary-page-editor">
      <PageHeader
        {...props}
        onUpdate={onUpdate}
        onChange={onChange}
        alertText="All changes to this page will be lost."
        isMoveDisabled
        isDuplicateDisabled
      />
      <PageSegment>
        <RichTextEditor
          id="summary-title"
          name="title"
          label="Calculated summary title"
          placeholder="e.g. We calculate the answer as [total], are you sure this is correct?"
          value={page.title}
          onUpdate={onChangeUpdate}
          controls={titleControls}
          size="large"
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          testSelector="txt-summary-title"
          allowableTypes={[ANSWER, METADATA, VARIABLES]}
          defaultTab="variables"
          errorValidationMsg={getValidationError({
            field: "title",
            label: "Calculated summary title",
            requiredMsg: "Enter a calculated summary title",
          })}
        />
        <div>
          <SelectorTitle>Answers to calculate</SelectorTitle>
          <AnswerSelector
            onUpdateCalculatedSummaryPage={onUpdateCalculatedSummaryPage}
            page={page}
          />
        </div>
        <RichTextEditor
          id="total-title"
          name="totalTitle"
          label="Total title"
          placeholder="e.g. Total value of answers"
          value={page.totalTitle}
          onUpdate={onChangeUpdate}
          controls={titleControls}
          size="large"
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          testSelector="txt-total-title"
        />
      </PageSegment>
    </div>
  );
};

CalculatedSummaryPageEditor.fragments = {
  CalculatedSummaryPage: gql`
    fragment CalculatedSummaryPage on CalculatedSummaryPage {
      id
      title
      alias
      totalTitle
      pageType
      position
      displayName
      ...AnswerSelector
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
    ${AnswerSelector.fragments.AnswerSelector}
    ${ValidationErrorInfoFragment}
  `,
};

CalculatedSummaryPageEditor.propTypes = {
  fetchAnswers: PropTypes.func.isRequired,
  page: propType(CalculatedSummaryPageEditor.fragments.CalculatedSummaryPage)
    .isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  onUpdateCalculatedSummaryPage: PropTypes.func.isRequired,
  getValidationError: PropTypes.func.isRequired,
};

export default flowRight(
  withUpdateCalculatedSummaryPage,
  withPropRenamed("onUpdateCalculatedSummaryPage", "onUpdate"),
  withValidationError("page"),
  withEntityEditor("page"),
  withChangeUpdate
)(CalculatedSummaryPageEditor);
