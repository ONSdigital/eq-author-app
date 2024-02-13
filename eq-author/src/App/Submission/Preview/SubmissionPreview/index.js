import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import PageTitle from "components/preview/elements/PageTitle";
import { Field, Label } from "components/Forms";
import Panel from "components-themed/panels";
import Feedback from "components-themed/Feedback";
import Error from "components/preview/Error";

const Wrapper = styled.div`
  padding: 2em;
  font-size: 18px;
`;

const Section = styled.div`
  &:not(:first-child) {
    margin-top: ${(props) =>
      props.marginTop ? `${props.marginTop}em` : `0.5em`};
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

const WarningPanelText = styled.div`
  font-weight: bold;
`;

const PanelSection = styled.div`
  font-size: 18px;
  margin-bottom: 1em;
`;

const Errorblock = styled(Error)`
  margin-top: 1em;
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

const Text = styled.p``;

const SubmissionEditor = ({ submission, questionnaireTitle }) => {
  const { furtherContent, viewPrintAnswers, feedback } = submission;

  const panelTitle = `Thank you for completing the ${questionnaireTitle}`;
  const feedbackTitle = `What do you think about this service?`;
  const answersAvailableToView = `For security, your answers will only be available to view for 11895327 minutes 10 seconds`;
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
      <SectionSeparator />
      {furtherContent !== "" ? (
        <Section dangerouslySetInnerHTML={{ __html: furtherContent }} />
      ) : (
        <Errorblock large>Missing additional content</Errorblock>
      )}
      {viewPrintAnswers && (
        <>
          <Section>
            <SectionSeparator />
            <PageTitle
              title={getCopyOfAnswers}
              missingText={missingTitleText}
            />
            <Text>We may contact you to query your answers.</Text>
            <Text>
              If you need a copy for your records,&nbsp;
              <BlueUnderlined>save or print your answers</BlueUnderlined>.
            </Text>
          </Section>
          <Section>
            <InlineField>
              <Panel variant="warning">
                <WarningPanelText>{answersAvailableToView}</WarningPanelText>
              </Panel>
            </InlineField>
            {feedback && <SectionSeparator />}
          </Section>
        </>
      )}
      {feedback && (
        <Section marginTop="1.3">
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
    feedback: PropTypes.bool,
  }),
  renderPanel: PropTypes.func,
  questionnaireTitle: PropTypes.string,
};

export default SubmissionEditor;
