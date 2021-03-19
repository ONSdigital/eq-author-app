import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter, useRouteMatch } from "react-router-dom";

import { colors } from "constants/theme";

import VerticalTabs from "components/VerticalTabs";
import tabItems from "./TabItems";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Field, Label } from "components/Forms";
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

const ThemesPage = ({ questionnaire }) => {
  const { type } = questionnaire;

  let match = useRouteMatch();

  return (
    <Container>
      <Header title="Settings" />
      <PageContainer>
        <PageMainCanvas>
          <Grid>
            <VerticalTabs
              title="Questionnaire Settings"
              cols={2.5}
              tabItems={tabItems(match.params, type)}
            />
            <Column gutters={false} cols={9.5}>
              <SettingsContainer>
                <ScrollPane>
                  <StyledPanel>
                    <Field>
                      <Label>Themes, IDs, form types and legal bases</Label>
                    </Field>
                    <Field>
                      <p data-test="theme-description">
                        {`The theme sets the design of the eQ for respondents.
                          It changes the header across the survey, as well as the
                          contact details and the legal basis on the introduction
                          page. The COVID theme also changes the thank you page
                          respondents see once they've submitted the survey.
                        `}
                      </p>
                    </Field>
                    <Field>
                      <p>
                        {`The preview theme is applied when you view 
                        the survey using the View Survey button.
                        `}
                      </p>
                    </Field>
                  </StyledPanel>
                </ScrollPane>
              </SettingsContainer>
            </Column>
          </Grid>
        </PageMainCanvas>
      </PageContainer>
    </Container>
  );
};
ThemesPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  questionnaire: PropTypes.object.isRequired,
};

export default withRouter(ThemesPage);
