import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter, useParams } from "react-router-dom";

import { colors } from "constants/theme";

import VerticalTabs from "components/VerticalTabs";
import tabItems from "./TabItems";
import CollapsibleToggled from "components/CollapsibleToggled";

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

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const themes = [
  {
    title: "GB theme",
    defaultOpen: true,
  },
  { title: "NI theme" },
  { title: "COVID theme" },
  { title: "EPE theme" },
  { title: "EPE NI theme" },
  { title: "UKIS theme" },
  { title: "UKIS NI theme" },
];

const ThemesPage = ({ questionnaire }) => {
  const { type } = questionnaire;

  const params = useParams();

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
                    <HorizontalSeparator />
                    {themes.map(({ title, defaultOpen }) => (
                      <CollapsibleToggled
                        key={`${title}-toggle`}
                        title={title}
                        defaultOpen={defaultOpen}
                      >
                        {/* Added some filler text to demonstrate the opening and 
                            closing; this should be removed in future tickets where 
                            we add the actual functionality. 
                          */}
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Praesent ut eros a turpis tincidunt consectetur
                          sit amet quis enim. Vivamus scelerisque finibus erat
                          id mattis. In leo dolor, faucibus non volutpat vel,
                          pellentesque et nibh.
                        </p>
                        <p>
                          Phasellus viverra malesuada tincidunt. Fusce vulputate
                          odio mauris, eu finibus nisl luctus quis. Sed
                          dignissim dapibus sapien, at sollicitudin neque auctor
                          non. Interdum et malesuada fames ac ante ipsum primis
                          in faucibus.
                        </p>
                      </CollapsibleToggled>
                    ))}
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
