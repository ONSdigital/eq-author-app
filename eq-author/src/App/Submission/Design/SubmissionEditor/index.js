import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { colors } from "constants/theme.js";
import { find } from "lodash";

import RichTextEditor from "components/RichTextEditor";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { Label, Field } from "components/Forms";
import { submissionErrors } from "constants/validationMessages";
import updateSubmissionMutation from "../../graphql/updateSubmission.graphql";

const Wrapper = styled.div`
  padding: 2em;
`;

const Section = styled.section`
  &:not(:last-of-type) {
    border-bottom: 1px solid ${colors.lightMediumGrey};
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
  margin: 0.2em 0 2em;
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0em;

  > * {
    margin-bottom: 0;
  }
`;

const contentControls = {
  heading: true,
  bold: true,
  emphasis: true,
  list: true,
  link: true,
};

const countLinks = (furtherContent) => {
  // https://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
  const linkCount = (furtherContent.match(/<a href/g) || []).length;

  return linkCount;
};

const SubmissionEditor = ({ submission }) => {
  const { furtherContent, viewPrintAnswers, feedback } = submission;

  const furtherContentError = find(submission.validationErrorInfo.errors, {
    errorCode: "ERR_VALID_REQUIRED",
  });

  const [updateSubmission] = useMutation(updateSubmissionMutation);

  return (
    <Wrapper data-test="submission-editor">
      <Section>
        <SectionTitle style={{ marginBottom: "0.4em" }}>
          Submission confirmation details
        </SectionTitle>
        <SectionDescription>
          A success panel is displayed at the top of the page and includes the
          submission date and reference number.
        </SectionDescription>
        <RichTextEditor
          id="submission-further-content"
          name="submissionFurtherContent"
          label="Additional content"
          value={furtherContent}
          controls={contentControls}
          onUpdate={({ value }) =>
            updateSubmission({
              variables: {
                input: { furtherContent: value },
              },
            })
          }
          errorValidationMsg={
            furtherContentError?.errorCode
              ? submissionErrors[furtherContentError.errorCode].message
              : null
          }
          testSelector="txt-submission-further-content"
          multiline
          linkCount={countLinks(furtherContent)}
          linkLimit={2}
        />
      </Section>
      <Section>
        <InlineField>
          <Label htmlFor="viewPrintAnswers">Get a copy of their answers</Label>
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
            value="viewPrintAnswers"
          />
        </InlineField>
        <SectionDescription>
          Provide a link for respondents to save and print their answers.
        </SectionDescription>
        <InlineField>
          <Label htmlFor="feedback">Give feedback</Label>
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
            value="feedback"
          />
        </InlineField>
        <SectionDescription>
          Provide a link for respondents to provide feedback about the service.
        </SectionDescription>
      </Section>
    </Wrapper>
  );
};

SubmissionEditor.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    furtherContent: PropTypes.string,
    viewPrintAnswers: PropTypes.bool,
    feedback: PropTypes.bool,
  }),
  renderPanel: PropTypes.func,
};

export default SubmissionEditor;
