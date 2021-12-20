import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { colors } from "constants/theme.js";

import RichTextEditor from "components/RichTextEditor";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { Label, Field } from "components/Forms";

import updateSubmissionMutation from "../../graphql/updateSubmission.graphql";

const Wrapper = styled.div`
  padding: 2em;
`;

const Section = styled.section`
  &:not(:last-of-type) {
    border-bottom: 1px solid ${colors.horizontalRuleGrey};
    margin-bottom: 1em;
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

  const [updateSubmission] = useMutation(updateSubmissionMutation);

  return (
    <Wrapper>
      <Section>
        <SectionTitle style={{ marginBottom: "0" }}>Page content</SectionTitle>
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
          onUpdate={({ value }) =>
            updateSubmission({
              variables: {
                input: { furtherContent: value },
              },
            })
          }
          testSelector="txt-submission-further-content"
        />
      </Section>
      <Section>
        <SectionTitle style={{ marginBottom: "0" }}>
          Submission content
        </SectionTitle>
        <SectionDescription>
          The content that informs users how to view or print their answers, get
          a confirmation email or how they can give feedback are displayed on
          the submission page by default. You can choose not to display these
          elements
        </SectionDescription>
        <InlineField>
          <Label>View/print answers</Label>
          <ToggleSwitch
            name="view-print-answers"
            id="viewPrintAnswers"
            onChange={({ value }) =>
              updateSubmission({
                variables: {
                  input: { viewPrintAnswers: value },
                },
              })
            }
            checked={viewPrintAnswers}
            hideLabels={false}
          />
        </InlineField>
        <InlineField>
          <Label>Email confirmation</Label>
          <ToggleSwitch
            name="email-confirmation"
            id="emailConfirmation"
            onChange={({ value }) =>
              updateSubmission({
                variables: {
                  input: { emailConfirmation: value },
                },
              })
            }
            checked={emailConfirmation}
            hideLabels={false}
          />
        </InlineField>
        <InlineField>
          <Label>Feedback</Label>
          <ToggleSwitch
            name="feedback"
            id="feedback"
            onChange={({ value }) =>
              updateSubmission({
                variables: {
                  input: { feedback: value },
                },
              })
            }
            checked={feedback}
            hideLabels={false}
          />
        </InlineField>
      </Section>
    </Wrapper>
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
