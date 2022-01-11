import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import IconText from "components/IconText";
import PageTitle from "components/preview/elements/PageTitle";
import { Field, Label } from "components/Forms";
import Panel from "components-themed/panels";
import Feedback from "components-themed/Feedback";
import Input from "components-themed/Input";
import Button from "components-themed/buttons";

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

const TitleWrapper = styled.div`
  margin-top: -0.35em;
`;

const WarningPanel = styled(IconText)`
  svg {
    height: 2em;
    width: 2em;
  }
`;

const WarningPanelText = styled.div`
  font-weight: bold;
  margin-left: 0.5em;
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

const ContentHeading = styled.span`
  font-weight: bold;
`;

const FeedbackLabel = styled(Label)`
  &:first-of-type {
    margin-top: -0.5em;
  }
  &:not(:last-of-type) {
    margin-bottom: 1.5em;
  }
  &:hover {
    cursor: auto;
  }
`;

const InlineFieldHeadingContainer = styled.div`
  width: 26%;
  font-weight: bold;
`;

const InlineFieldContentContainer = styled.div``;

const BlueUnderlined = styled.span`
  color: ${colors.blue};
  text-decoration: underline;
  font-weight: ${(props) => props.bold && `bold`};
`;

const SubmissionEditor = ({ submission, questionnaireTitle }) => {
  const { furtherContent, viewPrintAnswers, emailConfirmation, feedback } =
    submission;

  const panelTitle = `Thank you for completing the ${questionnaireTitle}`;
  const feedbackTitle = `What do you think about this service?`;
  const answersAvailableToView = `For security, your answers will only be available to view for 45 minutes`;
  const giveFeedback = `Give Feedback`;
  const getCopyOfAnswers = `Get a copy of your answers`;
  const missingTitleText = `Missing title text`;
  const commentsImprovements = `Your comments will help us make improvements`;

  return (
    <Wrapper>
      <Panel variant="success" withLeftBorder>
        <PanelSection>
          <TitleWrapper>
            <PageTitle title={panelTitle} missingText={missingTitleText} />
          </TitleWrapper>
        </PanelSection>
        <PanelSection>
          Your answers have been submitted for ru_name (trad_as).
        </PanelSection>
        <PanelSection>
          <InlineField>
            <InlineFieldHeadingContainer>
              Submitted on:
            </InlineFieldHeadingContainer>
            <InlineFieldContentContainer>
              Submission date
            </InlineFieldContentContainer>
          </InlineField>
          <InlineField>
            <InlineFieldHeadingContainer>
              Submission reference:
            </InlineFieldHeadingContainer>
            <InlineFieldContentContainer>
              Submission reference number
            </InlineFieldContentContainer>
          </InlineField>
        </PanelSection>
      </Panel>
      <Section dangerouslySetInnerHTML={{ __html: furtherContent }} />
      <SectionSeparator />
      {viewPrintAnswers && (
        <>
          <Section>
            <PageTitle
              title={getCopyOfAnswers}
              missingText={missingTitleText}
            />
            You can&nbsp;
            <BlueUnderlined>save or print your answers</BlueUnderlined>
            &nbsp;for your records.
          </Section>
          <Section>
            <InlineField>
              <WarningPanel icon={WarningIcon} left bold withMargin>
                <WarningPanelText>{answersAvailableToView}</WarningPanelText>
              </WarningPanel>
            </InlineField>
          </Section>
        </>
      )}
      {emailConfirmation && (
        <>
          <Section>
            <SectionSeparator />
            <PageTitle
              title="Get confirmation email"
              missingText={missingTitleText}
            />
            If you would like to be sent confirmation that you have completed
            your survey, enter your email address
          </Section>
          <Section>
            <ContentHeading>Email address</ContentHeading>
          </Section>
          <Section>
            This will not be stored and will only be used once to send your
            confirmation
          </Section>
          <Section>
            <Input id="email-confirmation" type="text" />
          </Section>
          <Section>
            <Button variant="confirm">Send confirmation</Button>
          </Section>
          <SectionSeparator />
        </>
      )}
      {feedback && (
        <Section>
          <Feedback>
            <PageTitle title={feedbackTitle} missingText={missingTitleText} />
            <FeedbackLabel bold={false}>{commentsImprovements}</FeedbackLabel>
            <FeedbackLabel bold={false}>
              <BlueUnderlined bold>{giveFeedback}</BlueUnderlined>
            </FeedbackLabel>
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
