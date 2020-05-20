import React, { useState } from "react";
<<<<<<< HEAD
import PropTypes from "prop-types";
=======
>>>>>>> Deleted settings modal, introduced settings page with some content
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { useMutation } from "react-apollo";

import { colors } from "constants/theme";

import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
<<<<<<< HEAD
import Panel, { InformationPanel } from "components/Panel";
import { Field, Input, Label } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";
=======
import Panel from "components/Panel";
import { Field, Input, Label } from "components/Forms";
>>>>>>> Deleted settings modal, introduced settings page with some content

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

<<<<<<< HEAD
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

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
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
=======
const PillContainer = styled.div`
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

const Separator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const Pill = ({ children }) => {
  return (
    <PillContainer>
      <p>{children}</p>
    </PillContainer>
  );
};

const SettingsPage = props => {
  const { title, shortTitle, type, id } = props.questionnaire.data;
>>>>>>> Deleted settings modal, introduced settings page with some content

  const [updateQuestionnaire] = useMutation(updateQuestionnaireMutation);
  const [questionnaireTitle, setQuestionnaireTitle] = useState(title);
  const [questionnaireShortTitle, setQuestionnaireShortTitle] = useState(
    shortTitle
  );

  const handleTitleChange = ({ value }) => {
<<<<<<< HEAD
    if (value !== "") {
      updateQuestionnaire({
        variables: { input: { id, title: value } },
      });
    }
=======
    if (value) {
      updateQuestionnaire({
        variables: { input: { id, title: value } },
      });
      return;
    }

    setQuestionnaireTitle(title);
    return;
>>>>>>> Deleted settings modal, introduced settings page with some content
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
          <Field>
            <Label>Questionnaire title</Label>
            <StyledInput
              value={questionnaireTitle}
              onChange={({ value }) => setQuestionnaireTitle(value)}
              onBlur={e => handleTitleChange({ ...e.target })}
            />
          </Field>
          <Field>
            <Label>Short title (optional)</Label>
            <Caption>
              This is only used within Author. Respondents always see the full
              questionnaire title.
            </Caption>
            <StyledInput
              value={questionnaireShortTitle}
              onChange={({ value }) => setQuestionnaireShortTitle(value)}
              onBlur={e => handleShortTitleChange({ ...e.target })}
            />
          </Field>
<<<<<<< HEAD
          <HorizontalSeparator />
=======
          <Separator />
>>>>>>> Deleted settings modal, introduced settings page with some content
          <Field>
            <Label>Questionnaire type</Label>
            <Pill>{type}</Pill>
          </Field>
<<<<<<< HEAD
          <HorizontalSeparator />
          <InlineField>
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
          </InlineField>
          <InformationPanel>
            Let respondents move between sections while they&apos;re completing
            the questionnaire.
          </InformationPanel>
          <HorizontalSeparator />
          <InlineField>
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
          </InlineField>
          <InformationPanel>
            Let respondents check their answers before submitting their
            questionnaire
          </InformationPanel>
=======
          <Separator />
>>>>>>> Deleted settings modal, introduced settings page with some content
        </StyledPanel>
      </ScrollPane>
    </Container>
  );
};
<<<<<<< HEAD
SettingsPage.propTypes = {
  questionnaire: PropTypes.string.isRequired,
};
=======
>>>>>>> Deleted settings modal, introduced settings page with some content

export default withRouter(SettingsPage);
