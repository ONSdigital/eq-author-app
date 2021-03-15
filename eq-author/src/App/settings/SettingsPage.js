import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { colors } from "constants/theme";

import Header from "components/EditorLayout/Header";
import { Grid, Column } from "components/Grid";

import VerticalTabs from "components/VerticalTabs";
import GeneralSettingsPage from "./GeneralSettingsPage";

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

const SettingsPage = ({ questionnaire }) => {
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
                <GeneralSettingsPage questionnaire={questionnaire} />
              </SettingsContainer>
            </Column>
          </Grid>
        </PageMainCanvas>
      </PageContainer>
    </Container>
  );
};
SettingsPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  questionnaire: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default withRouter(SettingsPage);
