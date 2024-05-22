import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { propType } from "graphql-anywhere";
import { flowRight } from "lodash/fp";
import { colors } from "constants/theme";

import confirmationFragment from "graphql/fragments/question-confirmation.graphql";
import withValidationError from "enhancers/withValidationError";

import RichTextEditor from "components/RichTextEditor";
import withEntityEditor from "components/withEntityEditor";
import { richTextEditorErrors } from "constants/validationMessages";

import ConfirmationOption from "./ConfirmationOption";

import PageTitleContainer from "components/PageTitle";

const Wrapper = styled.div`
  padding: 1em 2em 2em;
`;

const OptionsWrapper = styled.div`
  width: calc(85% - 1em);
  margin-top: 3em;
`;

const MarginLessConfirmationOption = styled(ConfirmationOption)`
  margin-bottom: 0;
`;

const HorizontalRule = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.grey};
  margin: 1.5em 0;
`;

export class UnwrappedEditor extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    confirmation: propType(confirmationFragment).isRequired,
    getValidationError: PropTypes.func.isRequired,
  };
  static fragments = {
    QuestionConfirmation: confirmationFragment,
  };

  handleRichTextUpdate = (...args) => {
    const { onChange, onUpdate } = this.props;
    onChange(...args, onUpdate);
  };

  render() {
    const {
      confirmation: { title, pageDescription, positive, negative },
      onChange,
      onUpdate,
    } = this.props;
    return (
      <Wrapper>
        <RichTextEditor
          id="confirmation-title"
          name="title"
          label="Confirmation question"
          value={title}
          onUpdate={this.handleRichTextUpdate}
          controls={{ highlight: true, piping: true }}
          size="large"
          testSelector="txt-confirmation-title"
          data-test="title-input"
          autoFocus={!title}
          errorValidationMsg={this.props.getValidationError({
            field: "title",
            label: "Confirmation Question title",
            requiredMsg: richTextEditorErrors.CONFIRMATION_TITLE_NOT_ENTERED,
          })}
        />
        <PageTitleContainer
          marginless
          pageDescription={pageDescription}
          errors={this.props.confirmation.validationErrorInfo?.errors}
          onChange={onChange}
          onUpdate={onUpdate}
        />
        <HorizontalRule />
        <OptionsWrapper>
          <ConfirmationOption
            label="Positive confirmation text"
            value={positive}
            name="positive"
            onChange={onChange}
            onUpdate={onUpdate}
            data-test="positive-input"
            confirmationoption={positive}
          />
          <MarginLessConfirmationOption
            label="Negative confirmation text"
            value={negative}
            name="negative"
            onChange={onChange}
            onUpdate={onUpdate}
            data-test="negative-input"
            confirmationoption={negative}
          />
        </OptionsWrapper>
      </Wrapper>
    );
  }
}

export default flowRight(
  withValidationError("confirmation"),
  withEntityEditor("confirmation")
)(UnwrappedEditor);
