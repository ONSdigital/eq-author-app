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
import CollapsibleToggled from "components/CollapsibleToggled";
import PageTitle from "components/PageTitle";
import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";
import {
  ANSWER,
  METADATA,
  VARIABLES,
} from "components/ContentPickerSelectv3/content-types";

import { LIST_COLLECTOR_QUALIFIER_PAGE_ERRORS } from "constants/validationMessages";

import PageHeader from "../../PageHeader";
import AnswersEditor from "../../QuestionPageEditor/AnswersEditor";
import withUpdateOption from "../../answers/withUpdateOption";

import UPDATE_PAGE_MUTATION from "graphql/updatePage.graphql";
import CommentFragment from "graphql/fragments/comment.graphql";

// Uses h2 with overwritten h4 styling to improve accessibility - https://www.w3schools.com/tags/tag_hn.asp
const Title = styled.h2`
  display: block;
  font-size: 1em;
  margin-top: 1.33em;
  margin-bottom: 1.33em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
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

const titleControls = {
  emphasis: true,
  piping: true,
};

const QualifierPageEditor = ({ page, onUpdateOption }) => {
  const {
    id,
    alias,
    title,
    additionalGuidanceEnabled,
    additionalGuidanceContent,
    pageDescription,
    folder,
    section,
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
        onChange={({ value }) => setQualifierPageAlias(value)}
        alias={qualifierPageAlias}
      />
      <StyledField>
        <Title>What is the qualifier question?</Title>
        <ContentContainer>
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
          controls={titleControls}
          allowableTypes={[ANSWER, METADATA, VARIABLES]}
          testSelector="qualifier-question"
        />
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
        <HorizontalSeparator />
        <CollapsibleToggled
          id="qualifier-page-additional-guidance-toggle"
          title="Additional guidance panel"
          quoted={false}
          onChange={({ value }) =>
            updatePage({
              variables: { input: { id, additionalGuidanceEnabled: value } },
            })
          }
          inline
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
        <AnswersEditor
          answers={page.answers}
          onUpdateOption={onUpdateOption}
          data-test="qualifier-page-answers-editor"
          page={page}
          metadata={page.section.questionnaire.metadata}
          withoutMargin
        />
      </StyledField>
    </>
  );
};

QualifierPageEditor.propTypes = {
  page: CustomPropTypes.page,
  onUpdateOption: PropTypes.func,
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

export default flow(withUpdateOption)(QualifierPageEditor);
