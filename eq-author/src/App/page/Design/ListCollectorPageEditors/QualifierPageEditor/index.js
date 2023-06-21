import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";
import gql from "graphql-tag";

import { Field } from "components/Forms";
import RichTextEditor from "components/RichTextEditor";
import CollapsibleToggled from "components/CollapsibleToggled";
import PageTitle from "components/PageTitle";

import { LIST_COLLECTOR_QUALIFIER_PAGE_ERRORS } from "constants/validationMessages";

import PageHeader from "../../PageHeader";
import AnswersEditor from "../../QuestionPageEditor/AnswersEditor";

import UPDATE_PAGE_MUTATION from "graphql/updatePage.graphql";

const Title = styled.h4`
  margin-bottom: -0.5em;
`;

const StyledField = styled(Field)`
  margin-left: 2em;
  margin-top: -1em;
`;

const ContentContainer = styled.div`
  width: ${(props) => props.width}%;
`;

const Content = styled.p``;

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const QualifierPageEditor = ({ page }) => {
  const {
    id,
    alias,
    title,
    additionalGuidanceEnabled,
    additionalGuidanceContent,
    pageDescription,
    validationErrorInfo,
  } = page;
  const [qualifierPageAlias, setQualifierPageAlias] = useState(alias);
  const [qualifierPageDescription, setQualifierPageDescription] =
    useState(pageDescription);

  const [updatePage] = useMutation(UPDATE_PAGE_MUTATION);

  const getErrorMessage = (field) => {
    const errorCodeResult = validationErrorInfo.errors.find(
      (error) => error.field === field
    )?.errorCode;

    return LIST_COLLECTOR_QUALIFIER_PAGE_ERRORS[errorCodeResult];
  };

  return (
    <>
      <PageHeader
        page={page}
        onUpdate={({ value }) =>
          updatePage({ variables: { input: { id, alias: value } } })
        }
        onChange={({ value }) => setQualifierPageAlias(value)}
        alias={qualifierPageAlias}
      />
      <StyledField>
        <Title>What is the qualifier question?</Title>
        <ContentContainer width="90">
          <Content>
            The qualifier question uses two radios to determine if there is a
            list to collect.
          </Content>
          <Content>
            If the respondent selects the positive answer, they proceed to the
            question for adding a list item. If the respondent selects the
            negative answer, they move to the next question after the list
            collector question pattern.
          </Content>
        </ContentContainer>
        <RichTextEditor
          id="qualifier-question"
          name="qualifier-question"
          label="Qualifier question"
          multiline
          value={title}
          onUpdate={({ value }) =>
            updatePage({
              variables: { input: { id, title: value } },
            })
          }
          errorValidationMsg={getErrorMessage("title")}
          // controls={}
          testSelector="qualifier-question"
        />
        <CollapsibleToggled
          id="qualifier-page-additional-guidance-toggle"
          title="Additional guidance panel"
          quoted={false}
          onChange={({ value }) =>
            updatePage({
              variables: { input: { id, additionalGuidanceEnabled: value } },
            })
          }
          isOpen={additionalGuidanceEnabled}
        >
          <RichTextEditor
            id="qualifier-page-additional-guidance-text-editor"
            name="qualifier-page-additional-guidance-text-editor"
            multiline
            value={additionalGuidanceContent}
            onUpdate={({ value }) =>
              updatePage({
                variables: { input: { id, additionalGuidanceContent: value } },
              })
            }
            errorValidationMsg={getErrorMessage("additionalGuidanceContent")}
            // controls={}
            testSelector="qualifier-page-additional-guidance"
          />
        </CollapsibleToggled>
        <ContentContainer width="100">
          <AnswersEditor
            answers={page.answers}
            // onUpdate={onUpdateAnswer}
            // onAddOption={onAddOption}
            // onAddExclusive={onAddExclusive}
            // onUpdateOption={onUpdateOption}
            // onDeleteOption={onDeleteOption}
            // onDeleteAnswer={(answerId) => onDeleteAnswer(id, answerId)}
            data-test="qualifier-page-answers-editor"
            page={page}
            metadata={page.section.questionnaire.metadata}
            withoutMargin
          />
        </ContentContainer>
        <HorizontalSeparator />
        <ContentContainer width="98">
          <PageTitle
            heading="Page title and description"
            pageDescription={qualifierPageDescription}
            onChange={({ value }) => setQualifierPageDescription(value)}
            onUpdate={({ value }) =>
              updatePage({
                variables: {
                  input: { id, pageDescription: value },
                },
              })
            }
            errors={validationErrorInfo.errors}
          />
        </ContentContainer>
      </StyledField>
    </>
  );
};

QualifierPageEditor.propTypes = {
  page: CustomPropTypes.page,
};

QualifierPageEditor.fragments = {
  ListCollectorQualifierPage: gql`
    fragment ListCollectorQualifierPage on ListCollectorQualifierPage {
      id
      alias
      title
      displayName
      pageType
      pageDescription
      position
      additionalGuidanceEnabled
      additionalGuidanceContent
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
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
  `,
};

export default QualifierPageEditor;
