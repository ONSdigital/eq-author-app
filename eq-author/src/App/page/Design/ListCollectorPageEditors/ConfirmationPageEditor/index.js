import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";
import gql from "graphql-tag";

import { Field } from "components/Forms";
import RichTextEditor from "components/RichTextEditor";
import PageTitle from "components/PageTitle";

import { LIST_COLLECTOR_CONFIRMATION_PAGE_ERRORS } from "constants/validationMessages";

import PageHeader from "../../PageHeader";

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

const ConfirmationPageEditor = ({ page }) => {
  const { id, alias, title, pageDescription, validationErrorInfo } = page;
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
        <HorizontalSeparator />
        <ContentContainer width="98">
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
            // altFieldName=""
            // altError=""
            errors={validationErrorInfo.errors}
          />
        </ContentContainer>
      </StyledField>
    </>
  );
};

ConfirmationPageEditor.propTypes = {
  page: CustomPropTypes.page,
};

ConfirmationPageEditor.fragments = {
  ListCollectorConfirmationPage: gql`
    fragment ListCollectorConfirmationPage on ListCollectorConfirmationPage {
      id
      alias
      title
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
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
  `,
};

export default ConfirmationPageEditor;
