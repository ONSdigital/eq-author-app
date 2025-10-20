import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { filter } from "graphql-anywhere";

import styled from "styled-components";
import { colors } from "constants/theme.js";
import gql from "graphql-tag";

import QuestionProperties from "App/page/Design/QuestionPageEditor/QuestionProperties";

import { Field } from "components/Forms";
import RichTextEditor from "components/RichTextEditor";
import Collapsible from "components/Collapsible";
import PageTitle from "components/PageTitle";

import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";
import {
  ANSWER,
  METADATA,
  VARIABLES,
} from "components/ContentPickerSelectv3/content-types";

import { LIST_COLLECTOR_ADD_ITEM_PAGE_ERRORS } from "constants/validationMessages";

import PageHeader from "../../PageHeader";

import UPDATE_PAGE_MUTATION from "graphql/updatePage.graphql";
import CommentFragment from "graphql/fragments/comment.graphql";
import addPageFragment from "graphql/fragments/list-collector-add-item-page.graphql";

// Uses h2 with overwritten h4 styling to improve accessibility - https://www.w3schools.com/tags/tag_hn.asp
const Title = styled.h2`
  display: block;
  font-size: 1em;
  margin-top: 1.33em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
  margin-bottom: ${(props) => props.marginBottom}em;
`;

const Container = styled.div``;

const StyledField = styled(Field)`
  padding: 0 2em;
`;

const Content = styled.p``;

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const StyledCollapsible = styled(Collapsible)`
  margin-top: 1em;
`;
const titleControls = {
  highlight: true,
  piping: true,
};

const AddItemPageEditor = ({ fetchAnswers, page }) => {
  const {
    id,
    alias,
    title,
    pageDescription,
    folder,
    section,
    validationErrorInfo,
  } = page;

  const [addItemPageAlias, setAddItemPageAlias] = useState(alias);
  const [addItemPageDescription, setAddItemPageDescription] =
    useState(pageDescription);
  const [addItemPage, setAddItemPage] = useState(page);

  useEffect(() => {
    setAddItemPage(addItemPage);
  }, [addItemPage]);

  const [updatePage] = useMutation(UPDATE_PAGE_MUTATION, {
    refetchQueries: ["GetPage"],
  });
  const getErrorMessage = (field) => {
    const errorCodeResult = validationErrorInfo.errors.find(
      (error) => error.field === field
    )?.errorCode;

    return LIST_COLLECTOR_ADD_ITEM_PAGE_ERRORS[errorCodeResult];
  };

  useSetNavigationCallbacksForPage({
    page,
    folder,
    section,
  });

  const handleChange = ({ name, value }) => {
    const updatedPage = { ...addItemPage };
    updatedPage[name] = value;
    setAddItemPage(updatedPage);
  };

  const handleOnUpdate = (event) => {
    const inputData = event.target || event;
    const updatedPage = { ...addItemPage };
    updatedPage[inputData.name] = inputData.value;
    setAddItemPage(updatedPage);
    const data = filter(addPageFragment, updatedPage);
    updatePage({
      variables: { input: data },
    });
  };

  return (
    <Container data-test="list-collector-add-item-page-editor">
      <PageHeader
        page={page}
        onUpdate={({ value }) =>
          updatePage({ variables: { input: { id, alias: value } } })
        }
        onChange={({ value }) => setAddItemPageAlias(value)}
        alias={addItemPageAlias}
      />
      <StyledField>
        <Title marginBottom="-0.5">
          What is the question for adding a list item?
        </Title>
        <Content>
          The question for adding a list item enables input or selection of one
          list item at a time. The associated answer template of the linked
          collection list determines the answer type for this question.
        </Content>
        <RichTextEditor
          id="add-item-question"
          name="add-item-question"
          label="Question for adding a list item"
          multiline
          value={title}
          onUpdate={({ value }) =>
            updatePage({
              variables: { input: { id, title: value } },
            })
          }
          errorValidationMsg={getErrorMessage("title")}
          size="large"
          controls={titleControls}
          allowableTypes={[ANSWER, METADATA, VARIABLES]}
          testSelector="add-item-question"
        />
        <PageTitle
          heading="Page title and description"
          pageDescription={addItemPageDescription}
          onChange={({ value }) => setAddItemPageDescription(value)}
          onUpdate={handleOnUpdate}
          errors={validationErrorInfo.errors}
        />
        <HorizontalSeparator />
        <QuestionProperties
          page={addItemPage}
          onChange={handleChange}
          onUpdate={handleOnUpdate}
          fetchAnswers={fetchAnswers}
          variant="marginlessContent"
          errors={validationErrorInfo.errors}
        />
        <StyledCollapsible title="Why can’t I add an answer type?">
          <Content>
            The answer type for the question for adding a list item is
            determined by the answer template in the linked collection list. To
            verify the linked collection list for this list collector question
            pattern or confirm its linkage, visit the folder page for the list
            collector question pattern.
          </Content>
          <Content>
            If multiple list collector question patterns are linked to the same
            collection list, the answer template is applied to all the questions
            for adding a list item.
          </Content>
        </StyledCollapsible>
        <Collapsible title="How to gather additional information on each list item">
          <Content>
            How you approach gathering additional information for each list item
            will depend on how much detail you need.
          </Content>
          <Title marginBottom="0.5">
            If up to 3 follow-up questions are needed:
          </Title>
          <Content>
            Adding follow-up questions after the question for adding a list item
            will allow the same information to be gathered for each item added.
            After answering the follow-up questions, the respondent is shown the
            summary page, which only displays the list items and allows them to
            confirm whether the list is complete.
          </Content>
          <Content>
            This process repeats until the list is complete. Follow-up questions
            are summarised in the section summary.
          </Content>
          <Title marginBottom="0.5">
            For more than 3 questions on each list item:
          </Title>
          <Content>
            Use the list collector question pattern (with no follow-up
            questions) to collect the list items. Then create a new repeating
            section linked to the same collection list as the list collector.
            Distinct sections featuring the same questions will be generated for
            each list item and displayed on the hub.
          </Content>
          <Title marginBottom="0.5">
            If percentage values for each list item are needed:
          </Title>
          <Content>
            Use a repeating label and an input with a percentage answer type to
            allow users to enter a percentage answer for each list item added to
            the collection list.
          </Content>
        </Collapsible>
        <Collapsible title="How do add follow-up questions to the list collector question pattern?">
          <Content>
            To add a follow-up question in the list collector folder, use the
            &apos;add/import content&apos; button and select the question
            option. The follow-up question will be placed between the question
            for adding a list item and the question to confirm list completion.
            You can add multiple follow-up questions and change their order, but
            the order of other list collector questions remains fixed.
          </Content>
        </Collapsible>
      </StyledField>
    </Container>
  );
};

AddItemPageEditor.propTypes = {
  page: CustomPropTypes.page,
  fetchAnswers: PropTypes.func,
};

AddItemPageEditor.fragments = {
  ListCollectorAddItemPage: gql`
    fragment ListCollectorAddItemPage on ListCollectorAddItemPage {
      id
      alias
      title
      displayName
      pageType
      pageDescription
      position
      folder {
        id
        position
        ... on ListCollectorFolder {
          listId
        }
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
      description
      descriptionEnabled
      guidance
      guidanceEnabled
      definitionLabel
      definitionContent
      definitionEnabled
      additionalInfoLabel
      additionalInfoContent
      additionalInfoEnabled
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

export default AddItemPageEditor;
