import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter, useParams } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";
import updateTheme from "graphql/updateTheme.graphql";
import getQuestionnaireQuery from "graphql/getQuestionnaire.graphql";
import { colors } from "constants/theme";

import VerticalTabs from "components/VerticalTabs";
import tabItems from "./TabItems";
import enableThemeMutation from "graphql/enableTheme.graphql";
import disableThemeMutation from "graphql/disableTheme.graphql";
import CollapsibleToggled from "components/CollapsibleToggled";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Field, Input, Label } from "components/Forms";
import { Grid, Column } from "components/Grid";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const SettingsContainer = styled.div`
  padding: 0.8em;
  border-left: 1px solid ${colors.lightGrey};
`;

const PageMainCanvas = styled.div`
  display: flex;
  border: 1px solid ${colors.lightGrey};
  border-radius: 4px;
  background: ${colors.white};
`;

const PageContainer = styled.div`
  padding: 0.8em;
  border-left: 1px solid ${colors.lightGrey};
`;

const StyledPanel = styled.div`
  max-width: 97.5%;
  padding: 1.3em;
`;

const StyledInput = styled(Input)`
  width: 31em;
`;

const Caption = styled.p`
  margin-top: 0.2em;
  margin-bottom: 0.6em;
  font-size: 0.85em;
`;

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const EqIdInput = ({ eqId = "", questionnaireId, shortName }) => {
  const [state, setState] = useState(eqId);
  const [updateQuestionnaireTheme] = useMutation(updateTheme);

  const handleEQIdBlur = ({ value }, shortName) => {
    value = value.trim();
    updateQuestionnaireTheme({
      variables: {
        input: { questionnaireId, shortName, eqId: value },
      },
    });
  };

  return (
    <StyledInput
      value={state}
      onChange={({ value }) => setState(value)}
      onBlur={(e) => handleEQIdBlur({ ...e.target }, shortName)}
      data-test={`${shortName}-eq-id-input`}
    />
  );
};

EqIdInput.propTypes = {
  eqId: PropTypes.string,
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string.isRequired,
};

const themes = [
  { title: "GB theme", shortName: "default", enabled: true },
  { title: "NI theme", shortName: "northernireland" },
  { title: "COVID theme", shortName: "covid" },
  { title: "EPE theme", shortName: "epe" },
  { title: "EPE NI theme", shortName: "epeni" },
  { title: "UKIS theme", shortName: "ukis" },
  { title: "UKIS NI theme", shortName: "ukisni" },
];

const matchThemes = (themes, questionnaireThemes) =>
  themes.map((theme) => {
    const target = questionnaireThemes.find(
      ({ shortName }) => shortName === theme.shortName
    );
    return target ? { ...theme, ...target, title: theme.title } : theme;
  });

const ThemesPage = ({ questionnaire }) => {
  const { type, surveyId, id, themes: questionnaireThemes } = questionnaire;
  const [updateQuestionnaire] = useMutation(updateQuestionnaireMutation);
  const [questionnaireId, setQuestionnaireId] = useState(surveyId);
  const params = useParams();

  const handleBlur = ({ value }) => {
    value = value.trim();
    updateQuestionnaire({
      variables: { input: { id, surveyId: value } },
    });
  };

  const [enableTheme] = useMutation(enableThemeMutation);
  const [disableTheme] = useMutation(disableThemeMutation);

  const toggleTheme = ({ shortName, enabled }) => {
    const handleToggle = enabled ? disableTheme : enableTheme;

    handleToggle({
      variables: { input: { questionnaireId: id, shortName } },
      ...(!enabled && {
        update: (client, { data: { enableTheme } }) => {
          const { questionnaire } = client.readQuery({
            query: getQuestionnaireQuery,
            variables: {
              input: { questionnaireId: id },
            },
          });
          // check here if the theme is in the array
          client.writeQuery({
            query: getQuestionnaireQuery,
            variables: {
              input: { questionnaireId: id },
            },
            data: {
              questionnaire: {
                ...questionnaire,
                themes: [...questionnaire.themes, enableTheme],
              },
            },
          });
        },
      }),
    });
  };

  return (
    <Container>
      <ScrollPane>
        <Header title="Settings" />
        <PageContainer>
          <PageMainCanvas>
            <Grid>
              <VerticalTabs
                title="Questionnaire settings"
                cols={2.5}
                tabItems={tabItems(params, type)}
              />
              <Column gutters={false} cols={9.5}>
                <SettingsContainer>
                  <StyledPanel>
                    <Field>
                      <Label>Themes, IDs, form types and legal bases</Label>
                    </Field>
                    <Field>
                      <p data-test="theme-description">
                        The theme sets the design of the eQ for respondents. It
                        changes the header across the survey, as well as the
                        contact details and the legal basis on the introduction
                        page. The COVID theme also changes the thank you page
                        respondents see once they&apos;ve submitted the survey.
                      </p>
                    </Field>
                    <Field>
                      <p>
                        The preview theme is applied when you view the survey
                        using the View Survey button.
                      </p>
                    </Field>

                    <Field>
                      <Label>Survey ID</Label>
                      <Caption>
                        The three-digit survey ID. For example, &apos;283&apos;
                      </Caption>
                      <StyledInput
                        maxLength="3"
                        value={questionnaireId}
                        onChange={({ value }) => setQuestionnaireId(value)}
                        onBlur={(e) => handleBlur({ ...e.target })}
                        data-test="change-questionnaire-id"
                      />
                    </Field>
                    <HorizontalSeparator />
                    {matchThemes(themes, questionnaireThemes).map(
                      ({ shortName, title, eqId, enabled }) => (
                        <CollapsibleToggled
                          key={`${title}-toggle`}
                          title={title}
                          isOpen={enabled}
                          onChange={() => toggleTheme({ shortName, enabled })}
                          data-test={`${shortName}-toggle`}
                        >
                          <p />
                          <Field>
                            <Label>eQ ID</Label>
                          </Field>
                          <EqIdInput
                            eqId={eqId}
                            questionnaireId={id}
                            shortName={shortName}
                          />
                        </CollapsibleToggled>
                      )
                    )}
                  </StyledPanel>
                </SettingsContainer>
              </Column>
            </Grid>
          </PageMainCanvas>
        </PageContainer>
      </ScrollPane>
    </Container>
  );
};
ThemesPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  questionnaire: PropTypes.object.isRequired,
};

export default withRouter(ThemesPage);
