import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import { get, flowRight, some } from "lodash";
import styled from "styled-components";
import gql from "graphql-tag";

import { richTextEditorErrors } from "constants/validationMessages";
import { colors } from "constants/theme";

import RichTextEditor from "components/RichTextEditor";
import withEntityEditor from "components/withEntityEditor";
import PageHeader from "../PageHeader";
import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";

import PageTitleContainer from "components/PageTitle";

import {
  ANSWER,
  METADATA,
  VARIABLES,
} from "components/ContentPickerSelectv3/content-types";

//new
import AnswerSelector from "./AnswerSelector";

import withPropRenamed from "enhancers/withPropRenamed";
import withChangeUpdate from "enhancers/withChangeUpdate";
import withUpdateCalculatedSummaryPage from "./withUpdateCalculatedSummaryPage";
import withValidationError from "enhancers/withValidationError";

import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";
import CommentFragment from "graphql/fragments/comment.graphql";
import AnswerFragment from "graphql/fragments/answer.graphql";

const titleControls = {
  emphasis: true,
  piping: true,
};

const PageSegment = styled.div`
  padding: 0 2em;
`;

const SelectorTitle = styled.h2`
  font-size: 1em;
  color: ${colors.black};
  margin: 0 0 0.4em;
`;

const HorizontalRule = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.2em 0;
`;

const {
  CALCSUM_TITLE_NOT_ENTERED,
  PIPING_TITLE_MOVED,
  PIPING_TITLE_DELETED,
  CALCSUM_TOTAL_TITLE_NOT_ENTERED,
} = richTextEditorErrors;

const ERROR_SITUATIONS = [
  {
    field: "title",
    condition: (errors) =>
      some(errors, {
        errorCode: CALCSUM_TITLE_NOT_ENTERED.errorCode,
      }),
    message: () => CALCSUM_TITLE_NOT_ENTERED.message,
  },
  {
    field: "title",
    condition: (errors) =>
      some(errors, {
        errorCode: PIPING_TITLE_MOVED.errorCode,
      }),
    message: () => PIPING_TITLE_MOVED.message,
  },
  {
    field: "title",
    condition: (errors) =>
      some(errors, {
        errorCode: PIPING_TITLE_DELETED.errorCode,
      }),
    message: () => PIPING_TITLE_DELETED.message,
  },
  {
    field: "totalTitle",
    condition: (errors) =>
      some(errors, {
        errorCode: CALCSUM_TOTAL_TITLE_NOT_ENTERED.errorCode,
      }),
    message: () => CALCSUM_TOTAL_TITLE_NOT_ENTERED.message,
  },
];

export const CalculatedSummaryPageEditor = (props) => {
  const {
    page,
    fetchAnswers,
    onUpdate,
    onChange,
    onChangeUpdate,
    onUpdateCalculatedSummaryPage,
  } = props;

  useSetNavigationCallbacksForPage({
    page: page,
    folder: page.folder,
    section: page.section,
  });

  const getErrorMessage = (errorField) => {
    for (let i = 0; i < ERROR_SITUATIONS.length; ++i) {
      const { condition, message, field } = ERROR_SITUATIONS[i];
      if (
        errorField === field &&
        condition(props.page.validationErrorInfo.errors)
      ) {
        return message(props.page.validationErrorInfo.errors);
      }
    }
  };

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
          placeholder=""
          value={page.title}
          onUpdate={onChangeUpdate}
          controls={titleControls}
          size="large"
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          testSelector="txt-summary-title"
          allowableTypes={[ANSWER, METADATA, VARIABLES]}
          defaultTab="variables"
          errorValidationMsg={getErrorMessage("title")}
          autoFocus={!page.title}
          pageType={page.pageType}
        />
        <HorizontalRule />
        <PageTitleContainer
          pageDescription={page.pageDescription}
          errors={props.page.validationErrorInfo.errors}
          onChange={onChange}
          onUpdate={onUpdate}
        />
        <HorizontalRule />
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
          placeholder=""
          value={page.totalTitle}
          onUpdate={onChangeUpdate}
          controls={titleControls}
          size="large"
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          errorValidationMsg={getErrorMessage("totalTitle")}
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
      pageDescription
      alias
      totalTitle
      pageType
      type
      position
      displayName
      answers {
        ...Answer
        ... on BasicAnswer {
          secondaryQCode
        }
      }
      folder {
        id
        position
      }
      section {
        id
        position
      }
      ...AnswerSelector
      validationErrorInfo {
        ...ValidationErrorInfo
      }
      comments {
        ...Comment
      }
    }
    ${CommentFragment}
    ${AnswerFragment}
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
};

export default flowRight(
  withUpdateCalculatedSummaryPage,
  withPropRenamed("onUpdateCalculatedSummaryPage", "onUpdate"),
  withValidationError("page"),
  withEntityEditor("page"),
  withChangeUpdate
)(CalculatedSummaryPageEditor);
