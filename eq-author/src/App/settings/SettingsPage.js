import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { useMutation } from "react-apollo";

import { colors } from "constants/theme";

import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import Panel, { InformationPanel } from "components/Panel";
import { Field as FullWidthField, Input, Label } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledPanel = styled(Panel)`
  max-width: 97.5%;
  margin: 1.5em auto;
  padding: 1.5em;
`;

const StyledInput = styled(Input)`
  width: 31em;
`;

const Caption = styled.p`
  margin-top: 0.2em;
  margin-bottom: 0.6em;
`;

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const VerticalSeparator = styled.div`
  width: 1px;
  height: 1.5em;
  background-color: ${colors.blue};
  margin: 0 1em;
  margin-bottom: 0.4em;
`;

const InlineFullWidthField = styled(FullWidthField)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
`;

const MediumWidthField = styled(FullWidthField)`
  width: 31em;
`;

const Pill = ({ children }) => {
  const Container = styled.div`
    width: 4em;
    padding: 0.5em 1em;
    box-sizing: content-box;
    background-color: ${colors.lightMediumGrey};
    text-align: center;

    p {
      margin: 0;
      font-weight: bold;
    }
  `;
  return (
    <Container>
      <p>{children}</p>
    </Container>
  );
};
Pill.propTypes = {
  children: PropTypes.string.isRequired,
};

const SettingsPage = ({ questionnaire }) => {
  const { title, shortTitle, type, id, navigation, summary } = questionnaire;

  const [updateQuestionnaire] = useMutation(updateQuestionnaireMutation);
  const [questionnaireTitle, setQuestionnaireTitle] = useState(title);
  const [questionnaireShortTitle, setQuestionnaireShortTitle] = useState(
    shortTitle
  );

  const handleTitleChange = ({ value }) => {
    if (value !== "") {
      updateQuestionnaire({
        variables: { input: { id, title: value } },
      });
    }
  };

  const handleShortTitleChange = ({ value }) => {
    updateQuestionnaire({
      variables: { input: { id, shortTitle: value } },
    });
  };

  return (
    <Container>
      <Header title="Settings" />
      <ScrollPane>
        <StyledPanel>
          <FullWidthField>
            <Label>Questionnaire title</Label>
            <Caption>Changes the questionnaire&apos;s title.</Caption>
            <StyledInput
              value={questionnaireTitle}
              onChange={({ value }) => setQuestionnaireTitle(value)}
              onBlur={e => handleTitleChange({ ...e.target })}
            />
          </FullWidthField>
          <MediumWidthField>
            <Label>Short title (optional)</Label>
            <Caption>
              Changes the questionnaire&apos;s short title. This is only used
              within Author. Respondents always see the full questionnaire
              title.
            </Caption>
            <StyledInput
              value={questionnaireShortTitle}
              onChange={({ value }) => setQuestionnaireShortTitle(value)}
              onBlur={e => handleShortTitleChange({ ...e.target })}
            />
          </MediumWidthField>
          <HorizontalSeparator />
          <FullWidthField>
            <Label>Questionnaire type</Label>
            <Pill>{type}</Pill>
          </FullWidthField>
          <HorizontalSeparator />
          <InlineFullWidthField>
            <Label>Section navigation</Label>
            <VerticalSeparator />
            <ToggleSwitch
              id="navigation"
              name="navigation"
              onChange={({ value }) =>
                updateQuestionnaire({
                  variables: { input: { id, navigation: value } },
                })
              }
              checked={navigation}
            />
          </InlineFullWidthField>
          <InformationPanel>
            Let respondents move between sections while they&apos;re completing
            the questionnaire.
          </InformationPanel>
          <HorizontalSeparator />
          <InlineFullWidthField>
            <Label>Answers summary</Label>
            <VerticalSeparator />
            <ToggleSwitch
              id="summary"
              name="summary"
              onChange={({ value }) =>
                updateQuestionnaire({
                  variables: { input: { id, summary: value } },
                })
              }
              checked={summary}
            />
          </InlineFullWidthField>
          <InformationPanel>
            Let respondents check their answers before submitting their
            questionnaire
          </InformationPanel>
        </StyledPanel>
      </ScrollPane>
    </Container>
  );
};
SettingsPage.propTypes = {
  questionnaire: PropTypes.string.isRequired,
};

export default withRouter(SettingsPage);
