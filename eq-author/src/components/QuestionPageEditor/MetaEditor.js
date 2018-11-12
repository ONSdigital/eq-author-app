import React from "react";
import { withApollo } from "react-apollo";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { flip, partial, flowRight } from "lodash";

import RichTextEditor from "components/RichTextEditor";
import withEntityEditor from "components/withEntityEditor";
import CharacterCounter from "components/CharacterCounter";
import { Field, Label } from "components/Forms";
import WrappingInput from "components/WrappingInput";

import pageFragment from "graphql/fragments/page.graphql";
import getAnswersQuery from "graphql/getAnswers.graphql";

import { colors, radius } from "constants/theme";

const titleControls = {
  emphasis: true,
  piping: true
};

const descriptionControls = {
  bold: true,
  emphasis: true,
  piping: true
};

const guidanceControls = {
  heading: true,
  bold: true,
  list: true,
  piping: true
};

const GuidanceEditor = styled(RichTextEditor)`
  border-left: 5px solid ${colors.borders};
`;

const Padding = styled.div`
  padding: 2em 0;
`;

const AliasField = styled(Field)`
  margin-bottom: 0.5em;
`;

const Alias = styled.div`
  padding: 0.5em;
  border: 1px solid ${colors.bordersLight};
  position: relative;
  border-radius: ${radius};

  &:focus-within {
    border-color: ${colors.blue};
    box-shadow: 0 0 0 1px ${colors.blue};
  }
`;

export class StatelessMetaEditor extends React.Component {
  render() {
    const { page, onChange, onUpdate, client } = this.props;
    const handleUpdate = partial(flip(onChange), onUpdate);

    const fetchAnswers = ids => {
      return client
        .query({
          query: getAnswersQuery,
          variables: { ids }
        })
        .then(result => result.data.answers);
    };

    return (
      <div>
        <Padding>
          <Alias>
            <AliasField>
              <Label htmlFor="question-alias">
                Question short code (optional)
              </Label>
              <WrappingInput
                id="question-alias"
                data-test="question-alias"
                name="alias"
                onChange={onChange}
                onBlur={onUpdate}
                value={page.alias}
                maxLength={255}
                autoFocus={!page.alias}
              />
            </AliasField>
            <CharacterCounter value={page.alias} limit={24} />
          </Alias>
        </Padding>
        <RichTextEditor
          id="title"
          label="Question"
          value={page.title}
          onUpdate={handleUpdate}
          controls={titleControls}
          size="large"
          fetchAnswers={fetchAnswers}
          metadata={page.section.questionnaire.metadata}
          testSelector="txt-question-title"
        />

        <RichTextEditor
          id="description"
          label="Question description (optional)…"
          value={page.description}
          onUpdate={handleUpdate}
          controls={descriptionControls}
          multiline
          fetchAnswers={fetchAnswers}
          metadata={page.section.questionnaire.metadata}
          testSelector="txt-question-description"
        />

        <GuidanceEditor
          id="guidance"
          label="Include and exclude guidance"
          value={page.guidance}
          onUpdate={handleUpdate}
          controls={guidanceControls}
          multiline
          fetchAnswers={fetchAnswers}
          metadata={page.section.questionnaire.metadata}
          testSelector="txt-question-guidance"
        />
      </div>
    );
  }
}

StatelessMetaEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  page: CustomPropTypes.page,
  client: CustomPropTypes.apolloClient.isRequired
};

StatelessMetaEditor.fragments = {
  Page: pageFragment
};

export default flowRight(
  withApollo,
  withEntityEditor("page", pageFragment)
)(StatelessMetaEditor);
