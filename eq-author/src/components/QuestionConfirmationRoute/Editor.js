import { propType } from "graphql-anywhere";
import { flow } from "lodash/fp";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import confirmationFragment from "graphql/fragments/question-confirmation.graphql";

import RichTextEditor from "components/RichTextEditor";
import withEntityEditor from "components/withEntityEditor";

import ConfirmationOption from "./ConfirmationOption";

const Wrapper = styled.div`
  padding: 1em 2em 2em;
`;

const OptionsWrapper = styled.div`
  width: calc(75% - 6em);
`;

const MarginLessConfirmationOption = styled(ConfirmationOption)`
  margin-bottom: 0;
`;

export class UnwrappedEditor extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    confirmation: propType(confirmationFragment).isRequired
  };
  static fragments = {
    QuestionConfirmation: confirmationFragment
  };

  handleRichTextUpdate = (...args) => {
    const { onChange, onUpdate } = this.props;
    onChange(...args, onUpdate);
  };

  render() {
    const {
      confirmation: { title, positive, negative },
      onChange,
      onUpdate
    } = this.props;
    return (
      <Wrapper>
        <RichTextEditor
          id="confirmation-title"
          label="Confirmation question"
          value={title}
          onUpdate={this.handleRichTextUpdate}
          controls={{ bold: true, emphasis: true }}
          size="large"
          testSelector="txt-confirmation-title"
          data-test="title-input"
          autoFocus={!title}
        />
        <OptionsWrapper>
          <ConfirmationOption
            label="Positive confirmation text"
            value={positive}
            name="positive"
            onChange={onChange}
            onUpdate={onUpdate}
            data-test="positive-input"
          />
          <MarginLessConfirmationOption
            label="Negative confirmation text"
            value={negative}
            name="negative"
            onChange={onChange}
            onUpdate={onUpdate}
            data-test="negative-input"
          />
        </OptionsWrapper>
      </Wrapper>
    );
  }
}

const withConfirmationEditing = flow(
  withEntityEditor("confirmation", confirmationFragment)
);

export default withConfirmationEditing(UnwrappedEditor);
