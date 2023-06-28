import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";
import gql from "graphql-tag";
import { flow } from "lodash";

import { Field } from "components/Forms";
import RichTextEditor from "components/RichTextEditor";
import PageTitle from "components/PageTitle";
import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";

import { LIST_COLLECTOR_CONFIRMATION_PAGE_ERRORS } from "constants/validationMessages";

import PageHeader from "../../PageHeader";
import AnswersEditor from "../../QuestionPageEditor/AnswersEditor";
import withUpdateOption from "../../answers/withUpdateOption";

import UPDATE_PAGE_MUTATION from "graphql/updatePage.graphql";
import CommentFragment from "graphql/fragments/comment.graphql";

const Title = styled.h4`
  margin-bottom: -0.5em;
`;

const StyledField = styled(Field)`
  padding: 0 2em;
`;

const ContentContainer = styled.span``;

const Content = styled.p``;

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const ConfirmationPageEditor = ({ page, onUpdateOption }) => {
  const {
    id,
    alias,
    title,
    pageDescription,
    folder,
    section,
    validationErrorInfo,
  } = page;
  const [confirmationPageAlias, setConfirmationPageAlias] = useState(alias);
  const [confirmationPageDescription, setConfirmationPageDescription] =
    useState(pageDescription);

  const [updatePage] = useMutation(UPDATE_PAGE_MUTATION);

  const getErrorMessage = (field) => {
    const errorCodeResult = validationErrorInfo.errors.find(
      (error) => error.field === field
    )?.errorCode;

    return LIST_COLLECTOR_CONFIRMATION_PAGE_ERRORS[errorCodeResult];
  };

  useSetNavigationCallbacksForPage({
    page,
    folder,
    section,
  });

  return (
    <>
      <PageHeader
        page={page}
        onUpdate={({ value }) =>
          updatePage({ variables: { input: { id, alias: value } } })
        }
        onChange={({ value }) => setConfirmationPageAlias(value)}
        alias={confirmationPageAlias}
      />
      <StyledField>
        <Title>What is the question to confirm list completion?</Title>
        <ContentContainer>
          <Content>
            This question uses two radios to confirm if the list is completed
            and is displayed on the summary page of added list items.
          </Content>
          <Content>
            If the respondent selects the positive answer, the respondent is
            taken to the question to add another list item. If the respondent
            selects the negative answer, the respondent proceeds to the next
            question after the list collector.
          </Content>
        </ContentContainer>
        <RichTextEditor
          id="confirmation-question"
          name="confirmation-question"
          label="Question to confirm list completion"
          multiline
          value={title}
          onUpdate={({ value }) =>
            updatePage({
              variables: { input: { id, title: value } },
            })
          }
          errorValidationMsg={getErrorMessage("title")}
          // controls={}
          testSelector="confirmation-question"
        />
        <AnswersEditor
          answers={page.answers}
          onUpdateOption={onUpdateOption}
          data-test="list-collector-confirmation-page-answers-editor"
          page={page}
          metadata={page.section.questionnaire.metadata}
          withoutMargin
        />
        <HorizontalSeparator />
        <PageTitle
          heading="Page title and description"
          pageDescription={confirmationPageDescription}
          inputTitlePrefix="Page"
          onChange={({ value }) => setConfirmationPageDescription(value)}
          onUpdate={({ value }) =>
            updatePage({
              variables: { input: { id, pageDescription: value } },
            })
          }
          errors={validationErrorInfo.errors}
        />
      </StyledField>
    </>
  );
};

ConfirmationPageEditor.propTypes = {
  page: CustomPropTypes.page,
  onUpdateOption: PropTypes.func,
};

ConfirmationPageEditor.fragments = {
  ListCollectorConfirmationPage: gql`
    fragment ListCollectorConfirmationPage on ListCollectorConfirmationPage {
      id
      alias
      title
      displayName
      pageType
      pageDescription
      position
      answers {
        ...AnswerEditor
      }
      folder {
        id
        position
      }
      section {
        id
        position
        repeatingSection
        allowRepeatingSection
        repeatingSectionListId
        questionnaire {
          id
          metadata {
            id
            displayName
            type
            key
          }
        }
      }
      comments {
        ...Comment
      }
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
    ${CommentFragment}
  `,
};

export default flow(withUpdateOption)(ConfirmationPageEditor);
