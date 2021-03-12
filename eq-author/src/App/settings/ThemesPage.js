import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { colors } from "constants/theme";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Field } from "components/Forms";
import { Grid, Column } from "components/Grid";

import VerticalTabs from "components/VerticalTabs";

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

const ThemesPage = () => {
  const tabItems = [
    {
      title: `General`,
      url: `settings`,
    },
    {
      title: `Themes, IDs and form types`,
      url: `themes`,
    },
  ];

  return (
    <Container>
      <Header title="Settings" />
      <PageContainer>
        <PageMainCanvas>
          <Grid>
            <VerticalTabs
              title="Questionnaire Settings"
              cols={2.5}
              tabItems={tabItems}
            />
            <Column gutters={false} cols={9.5}>
              <SettingsContainer>
                <ScrollPane>
                  <StyledPanel>
                    <Field>
                      <p>
                        {`Themes, IDs, form types and legal bases" and I see a
                        paragraph which says "The theme sets the design of the
                        eQ for respondents. It changes the header across the
                        survey, as well as the contact details and the legal
                        basis on the introduction page. The COVID theme also
                        changes the thank you page respondents see once they've
                        submitted the survey." and I see another paragraph which
                        says "The preview theme is applied when you view the
                        survey using the View survey button`}
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
