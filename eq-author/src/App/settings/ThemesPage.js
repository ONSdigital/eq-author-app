import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter, useRouteMatch } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";

import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";
import { colors } from "constants/theme";

import VerticalTabs from "components/VerticalTabs";
import tabItems from "./TabItems";

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

const ThemesPage = ({ questionnaire }) => {
  const { type, surveyId, id } = questionnaire;
  const [updateQuestionnaire] = useMutation(updateQuestionnaireMutation);
  const [questionnaireId, setQuestionnaireId] = useState(surveyId);
  const match = useRouteMatch();

  const handleBlur = ({ value }) => {
    value = value.trim();
    if (value !== "") {
      updateQuestionnaire({
        variables: { input: { id, surveyId: value } },
      });
    }
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
                tabItems={tabItems(match.params, type)}
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
                        // type="number" needs validation IMO
                        maxLength="3"
                        value={questionnaireId}
                        onChange={({ value }) => setQuestionnaireId(value)}
                        onBlur={(e) => handleBlur({ ...e.target })}
                        data-test="change-questionnaire-id"
                      />
                    </Field>
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
