import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";
import gql from "graphql-tag";

import { Field, Label } from "components/Forms";
import RichTextEditor from "components/RichTextEditor";
import CollapsibleToggled from "components/CollapsibleToggled";
import PageTitle from "components/PageTitle";

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

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => (props.open ? "0.4em" : "2em")};
  > * {
    margin-bottom: 0;
  }
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
  const { id, alias } = page;
  const [qualifierPageAlias, setQualifierPageAlias] = useState(alias);

  const [updatePage] = useMutation(UPDATE_PAGE_MUTATION);

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
          // value={}
          onUpdate={() => console.log("Temporary function")}
          // errorValidationMsg={}
          // controls={}
          testSelector="qualifier-question"
        />
        <InlineField>
          <Label>Additional guidance panel</Label>
          <CollapsibleToggled
            id="qualifier-page-additional-guidance-toggle"
            quoted={false}
            onChange={() => console.log("Temporary function")}
          >
            <RichTextEditor
              id="qualifier-page-additional-guidance-text-editor"
              name="qualifier-page-additional-guidance-text-editor"
              multiline
              // value={}
              onUpdate={() => console.log("Temporary function")}
              // errorValidationMsg={}
              // controls={}
              testSelector="qualifier-page-additional-guidance"
            />
          </CollapsibleToggled>
        </InlineField>
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
            pageDescription="" // TODO: Update this
            inputTitlePrefix="Page"
            onChange={() => console.log("onChange")}
            onUpdate={() => console.log("onUpdate")}
            // altFieldName=""
            // altError=""
            // errors={[]}
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
      pageType
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

export default QualifierPageEditor;
