import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import IconText from "components/IconText";
import PageTitle from "components/preview/elements/PageTitle";
import { Field, Label } from "components/Forms";
import Panel from "components-themed/panels";
import Feedback from "components-themed/Feedback";

import { ReactComponent as WarningIcon } from "assets/icon-warning-round.svg";

const Wrapper = styled.div`
  padding: 2em;
  font-size: 18px;
`;

const Section = styled.div`
  &:not(:first-child) {
    margin-top: 1em;
  }
`;

const SectionSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin-top: 1em;
`;

const SectionTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const TitleWrapper = styled.div`
  margin-top: -0.35em;
`;

const WarningPanel = styled(IconText)`
  svg {
    height: 2em;
    width: 2em;
  }
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

const FeedbackLabel = styled(Label)`
  &:not(:last-of-type) {
    margin-bottom: 1.5em;
  }
`;

const InlineFieldHeadingContainer = styled.div`
  width: 26%;
`;

const InlineFieldContentContainer = styled.div``;

const SubmissionEditor = ({ submission, questionnaireTitle }) => {
  const { furtherContent, viewPrintAnswers, emailConfirmation, feedback } =
    submission;

  const panelTitle = `Thank you for completing the ${questionnaireTitle}`;
  const feedbackTitle = `What do you think about this service?`;
  const saveOrPrint = `You can save or print your answers for your records`;
  const answersAvailableToView = `For security, your answers will only be available to view for 45 minutes`;
  const giveFeedback = `Give Feedback`;

  return (
    <Wrapper>
      <Panel variant="success" withLeftBorder>
        <PanelSection>
          <TitleWrapper>
            <PageTitle title={panelTitle} missingText="Missing title text" />
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
      <Section>
        <Label bold={false}>Further content</Label>
      </Section>
      <SectionSeparator />
      {viewPrintAnswers && (
        <>
          <Section>
            <SectionTitle>Get a copy of your answers</SectionTitle>
            <Label bold={false}>{saveOrPrint}</Label>
          </Section>
          <Section>
            <InlineField>
              <WarningPanel icon={WarningIcon} left bold withMargin>
                {answersAvailableToView}
              </WarningPanel>
            </InlineField>
          </Section>
        </>
      )}
      {feedback && (
        <Section>
          <Feedback>
            <PageTitle title={feedbackTitle} missingText="Missing title text" />
            <FeedbackLabel bold={false}>{saveOrPrint}</FeedbackLabel>
            <FeedbackLabel bold={false}>{giveFeedback}</FeedbackLabel>
          </Feedback>
        </Section>
      )}
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
  questionnaireTitle: PropTypes.string,
};

export default SubmissionEditor;
