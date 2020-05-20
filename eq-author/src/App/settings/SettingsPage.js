import React, { useState } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { useMutation } from "react-apollo";

import { colors } from "constants/theme";

import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import Panel from "components/Panel";
import { Field, Input, Label } from "components/Forms";

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

  const [updateQuestionnaire] = useMutation(updateQuestionnaireMutation);
  const [questionnaireTitle, setQuestionnaireTitle] = useState(title);
  const [questionnaireShortTitle, setQuestionnaireShortTitle] = useState(
    shortTitle
  );

  const handleTitleChange = ({ value }) => {
    if (value) {
      updateQuestionnaire({
        variables: { input: { id, title: value } },
      });
      return;
    }

    setQuestionnaireTitle(title);
    return;
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
          <Separator />
          <Field>
            <Label>Questionnaire type</Label>
            <Pill>{type}</Pill>
          </Field>
          <Separator />
        </StyledPanel>
      </ScrollPane>
    </Container>
  );
};

export default withRouter(SettingsPage);
