import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";
import gql from "graphql-tag";

import { Field } from "components/Forms";
import RichTextEditor from "components/RichTextEditor";
import Collapsible from "components/Collapsible";
import PageTitle from "components/PageTitle";

import { LIST_COLLECTOR_ADD_ITEM_PAGE_ERRORS } from "constants/validationMessages";

import PageHeader from "../../PageHeader";

import UPDATE_PAGE_MUTATION from "graphql/updatePage.graphql";

const Title = styled.h4`
  margin-bottom: ${(props) => props.marginBottom}em;
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

const AddItemPageEditor = ({ page }) => {
  const { id, alias, title, pageDescription, validationErrorInfo } = page;
  const [addItemPageAlias, setAddItemPageAlias] = useState(alias);
  const [addItemPageDescription, setAddItemPageDescription] =
    useState(pageDescription);

  const [updatePage] = useMutation(UPDATE_PAGE_MUTATION);

  const getErrorMessage = (field) => {
    const errorCodeResult = validationErrorInfo.errors.find(
      (error) => error.field === field
    )?.errorCode;

    return LIST_COLLECTOR_ADD_ITEM_PAGE_ERRORS[errorCodeResult];
  };

  return (
    <>
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
        <ContentContainer>
          <Content>
            The question for adding a list item enables input or selection of
            one list item at a time. The associated answer template of the
            linked collection list determines the answer type for this question.
          </Content>
        </ContentContainer>
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
          // controls={}
          testSelector="add-item-question"
        />
        <Collapsible title="Why can’t I add an answer type?">
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
        </Collapsible>
        <Collapsible title="Design approaches to gather additional information on each list item">
          <Content>
            3 recommended design approaches are available for gathering
            information on each list item.
          </Content>
          <Title marginBottom="0.5">
            For up to 3 questions on each list item:
          </Title>
          <Content>
            Extend the list collector question pattern by adding follow-up
            questions after the question for adding a list item. This allows the
            same information to be gathered for each item added. After answering
            the follow-up questions, respondents proceed to the summary page,
            which displays only the list items and includes the question to
            confirm list completion. This process repeats until the list is
            complete. Follow-up questions are summarised in the section summary.
          </Content>
          <Title marginBottom="0.5">
            For more than 3 questions on each list item:
          </Title>
          <Content>
            Use the list collector question pattern (with no follow-up
            questions) to collect the list items, and then create a new
            repeating section linked to the same collection list as the list
            collector. Distinct sections, featuring the same questions, will be
            generated for each list item and displayed on the hub.
          </Content>
          <Title marginBottom="0.5">
            If percentage values for each list item are needed:
          </Title>
          <Content>
            Use a repeating label and input with a percentage answer type to
            generate a label and input field for each item added to the linked
            collection list.
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
        <HorizontalSeparator />
        <ContentContainer width="98">
          <PageTitle
            heading="Page title and description"
            pageDescription={addItemPageDescription}
            onChange={({ value }) => setAddItemPageDescription(value)}
            onUpdate={({ value }) =>
              updatePage({
                variables: { input: { id, pageDescription: value } },
              })
            }
            // altFieldName=""
            // altError=""
            // errors={[]}
          />
        </ContentContainer>
      </StyledField>
    </>
  );
};

AddItemPageEditor.propTypes = {
  page: CustomPropTypes.page,
};

AddItemPageEditor.fragments = {
  ListCollectorAddItemPage: gql`
    fragment ListCollectorAddItemPage on ListCollectorAddItemPage {
      id
      alias
      title
      pageType
      pageDescription
      position
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

export default AddItemPageEditor;
