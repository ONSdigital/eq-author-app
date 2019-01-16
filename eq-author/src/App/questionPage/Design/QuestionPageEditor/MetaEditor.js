import React from "react";
import { withApollo } from "react-apollo";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import { get, flip, partial, flowRight } from "lodash";

import WrappingInput from "components/Forms/WrappingInput";
import RichTextEditor from "components/RichTextEditor";
import { Field, Label } from "components/Forms";

import DefinitionEditor from "./DefinitionEditor";

import pageFragment from "graphql/fragments/page.graphql";
import getAnswersQuery from "graphql/getAnswers.graphql";

import { colors } from "constants/theme";

const titleControls = {
  emphasis: true,
  piping: true,
};

const descriptionControls = {
  bold: true,
  emphasis: true,
  piping: true,
};

const guidanceControls = {
  heading: true,
  bold: true,
  list: true,
  piping: true,
};

const Paragraph = styled.p`
  margin: 0 0 1em;
  background: ${colors.lighterGrey};
  padding: 0.5em;
  border-left: 5px solid ${colors.lightGrey};
`;

export class StatelessMetaEditor extends React.Component {
  render() {
    const { page, onChange, onUpdate, client } = this.props;
    const handleUpdate = partial(flip(onChange), onUpdate);

    const fetchAnswers = ids => {
      return client
        .query({
          query: getAnswersQuery,
          variables: { ids },
        })
        .then(result => result.data.answers);
    };

    return (
      <div>
        <RichTextEditor
          id="question-title"
          name="title"
          label="Question"
          placeholder="What is the question?"
          value={page.title}
          onUpdate={handleUpdate}
          controls={titleControls}
          size="large"
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          testSelector="txt-question-title"
          autoFocus={!page.title}
        />
        <RichTextEditor
          id="question-description"
          name="description"
          label="Question description"
          value={page.description}
          onUpdate={handleUpdate}
          controls={descriptionControls}
          multiline
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          testSelector="txt-question-description"
        />
        <DefinitionEditor label="Question definition">
          <Paragraph>
            Only to be used to define word(s) or acronym(s) within the question.
          </Paragraph>
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
            />
          </Field>
          <RichTextEditor
            id="definition-content"
            name="definitionContent"
            label="Content"
            value={page.definitionContent}
            onUpdate={handleUpdate}
            controls={descriptionControls}
            multiline
            fetchAnswers={fetchAnswers}
            metadata={page.section.questionnaire.metadata}
            testSelector="txt-question-definition-content"
          />
        </DefinitionEditor>
        <RichTextEditor
          id="question-guidance"
          name="guidance"
          label="Include/exclude"
          value={page.guidance}
          onUpdate={handleUpdate}
          controls={guidanceControls}
          multiline
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          testSelector="txt-question-guidance"
        />
      </div>
    );
  }
}

StatelessMetaEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  page: propType(pageFragment).isRequired,
  client: CustomPropTypes.apolloClient.isRequired,
};

StatelessMetaEditor.fragments = {
  Page: pageFragment,
};

export default flowRight(withApollo)(StatelessMetaEditor);
