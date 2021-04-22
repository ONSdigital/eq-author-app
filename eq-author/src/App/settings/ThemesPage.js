import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter, useParams } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";
import updateTheme from "graphql/updateTheme.graphql";
import { colors } from "constants/theme";

import VerticalTabs from "components/VerticalTabs";
import tabItems from "./TabItems";
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

const EqIdInput = ({ eqId, onBlur, shortName }) => {
  const [state, setState] = useState(eqId);
  return (
    <StyledInput
      value={state}
      onChange={({ value }) => setState(value)}
      onBlur={(e) => onBlur({ ...e.target }, shortName)}
      data-test="change-eq-id"
    />
  );
};

EqIdInput.propTypes = {
  eqId: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  shortName: PropTypes.string.isRequired,
};

const themes = [
  {
    title: "GB theme",
    shortName: "default",
  },
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
  const [updateQuestionnaireTheme] = useMutation(updateTheme);
  const [questionnaireId, setQuestionnaireId] = useState(surveyId);
  const params = useParams();

  const handleBlur = ({ value }) => {
    value = value.trim();
    if (value !== "") {
      updateQuestionnaire({
        variables: { input: { id, surveyId: value } },
      });
    }
  };

  const handleEQIdBlur = ({ value }, shortName) => {
    value = value.trim();
    if (value !== "") {
      updateQuestionnaireTheme({
        variables: {
          input: { questionnaireId: id, shortName, eqId: value },
        },
      });
    }
  };

  console.log(questionnaireThemes);

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
                          defaultOpen={enabled}
                          questionnaireId={id}
                          shortName={shortName}
                        >
                          {/* Added some filler text to demonstrate the opening and 
                            closing; this should be removed in future tickets where 
                            we add the actual functionality. 
                          */}
                          <p />
                          <Field>
                            <Label>EQ ID</Label>
                          </Field>
                          <EqIdInput
                            eqId={eqId}
                            shortName={shortName}
                            onBlur={handleEQIdBlur}
                          />
                          <p>
                            Phasellus viverra malesuada tincidunt. Fusce
                            vulputate odio mauris, eu finibus nisl luctus quis.
                            Sed dignissim dapibus sapien, at sollicitudin neque
                            auctor non. Interdum et malesuada fames ac ante
                            ipsum primis in faucibus.
                          </p>
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
