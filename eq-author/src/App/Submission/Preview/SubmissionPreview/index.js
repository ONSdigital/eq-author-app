import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import PageTitle from "components/preview/elements/PageTitle";
import { Field, Label } from "components/Forms";
import Panel from "components-themed/panels";

const Padding = styled.div`
  padding: 2em;
`;

const Content = styled.div`
  font-size: 18px;
  margin-top: 1em;
`;

const TitleWrapper = styled.div`
  margin-top: -0.35em;
`;

const PanelSection = styled.div`
  font-size: 18px;
  margin-bottom: 1em;
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
`;

const InlineFieldHeadingContainer = styled.div`
  width: 26%;
`;

const InlineFieldContentContainer = styled.div``;

const SubmissionEditor = ({ submission, questionnaireTitle }) => {
  const { furtherContent, viewPrintAnswers, emailConfirmation, feedback } =
    submission;

  const pageTitle = `Thank you for completing the ${questionnaireTitle}`;

  return (
    <Padding>
      <Panel variant="success" withLeftBorder>
        <PanelSection>
          <TitleWrapper>
            <PageTitle title={pageTitle} missingText="Missing title text" />
          </TitleWrapper>
        </PanelSection>
        <PanelSection>
          Your answers have been submitted for ru_name (trad_as).
        </PanelSection>
        <PanelSection>
          <InlineField>
            <InlineFieldHeadingContainer>
              <Label>Submitted on:</Label>
            </InlineFieldHeadingContainer>
            <InlineFieldContentContainer>
              <Label bold={false}>Submission date</Label>
            </InlineFieldContentContainer>
          </InlineField>
          <InlineField>
            <InlineFieldHeadingContainer>
              <Label>Submission reference:</Label>
            </InlineFieldHeadingContainer>
            <InlineFieldContentContainer>
              <Label bold={false}>Submission reference number</Label>
            </InlineFieldContentContainer>
          </InlineField>
        </PanelSection>
      </Panel>
      <Content>Further content</Content>
    </Padding>
  );
};

SubmissionEditor.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    furtherContent: PropTypes.string,
    viewPrintAnswers: PropTypes.bool,
    emailConfirmation: PropTypes.bool,
    feedback: PropTypes.bool,
  }),
  renderPanel: PropTypes.func,
  questionnaireTitle: PropTypes.string,
};

export default SubmissionEditor;
