import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import RichTextEditor from "components/RichTextEditor";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { Label, Field } from "components/Forms";

import { noop } from "lodash/fp";

const Padding = styled.div`
  padding: 2em;
`;

const Section = styled.section`
  &:not(:last-of-type) {
    border-bottom: 1px solid #e0e0e0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 1em;
`;

const SectionDescription = styled.p`
  margin: 0.1em 0 1em;
  color: ${({ theme }) => theme.colors.textLight};
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
`;

// TODO: Piping answer
const contentControls = {
  heading: true,
  bold: true,
  emphasis: true,
  piping: true,
  list: true,
  link: true,
};

const SubmissionEditor = ({ submission }) => {
  const { furtherContent, viewPrintAnswers, emailConfirmation, feedback } =
    submission;

  return (
    <>
      <Section>
        <Padding>
          <SectionTitle style={{ marginBottom: "0" }}>
            Page content
          </SectionTitle>
          <SectionDescription>
            Uneditable content is not listed in the design view of this page. To
            view all content, including uneditable content, use preview.
          </SectionDescription>
          <RichTextEditor
            id="submission-further-content"
            name="submissionFurtherContent"
            label="Further content"
            value={furtherContent}
            controls={contentControls}
            size="large"
            onUpdate={noop}
            testSelector="txt-submission-further-content"
          />
        </Padding>
      </Section>
      <Section>
        <Padding>
          <SectionTitle style={{ marginBottom: "0" }}>
            Submission content
          </SectionTitle>
          <SectionDescription>
            The content that informs users how to view or print their answers,
            get a confirmation email or how they can give feedback are displayed
            on the submission page by default. You can choose not to display
            these elements
          </SectionDescription>
          <InlineField>
            <Label>View/print answers</Label>
            <ToggleSwitch
              name="view-print-answers"
              id="viewPrintAnswers"
              // onChange={}
              checked={viewPrintAnswers}
              hideLabels={false}
            />
          </InlineField>
          <InlineField>
            <Label>Email confirmation</Label>
            <ToggleSwitch
              name="email-confirmation"
              id="emailConfirmation"
              // onChange={}
              checked={emailConfirmation}
              hideLabels={false}
            />
          </InlineField>
          <InlineField>
            <Label>Feedback</Label>
            <ToggleSwitch
              name="feedback"
              id="feedback"
              // onChange={}
              checked={feedback}
              hideLabels={false}
            />
          </InlineField>
        </Padding>
      </Section>
    </>
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
};

export default SubmissionEditor;
