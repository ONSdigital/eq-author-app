import React from "react";
import styled from "styled-components";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Grid } from "components/Grid";
import { colors } from "constants/theme";
import MainCanvas from "components/MainCanvas";

import { Panel, InformationPanel } from "components/Panel";
import Button from "components/buttons/Button";
import OnsButton from "components/buttons/onsButton";
import IconText from "components/IconText";
import viewIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/view-survey-icon.svg?inline";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledGrid = styled(Grid)`
  overflow: hidden;
  padding-top: 2em;
  &:focus-visible {
    border: 3px solid ${colors.focus};
    margin: 0;
    outline: none;
  }
`;

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0;
  max-width: 80em;
`;

const Layout = styled.div`
  padding: 1.8em;
  &:focus-visible {
    border: 3px solid ${colors.focus};
    margin: 0;
    outline: none;
  }
`;

const Section = styled.div`
  color: ${colors.text};
  padding: 1.5em 0;
  border-bottom: 1px solid #e0e0e0;
  &:first-of-type {
    padding-top: 0;
  }
  &:last-of-type {
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.4em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
`;

const SectionContent = styled.p`
  font-weight: 400;
  color: ${colors.text};
`;

const BorderedButton = styled(Button)`
  border: 1px solid ${colors.primary};
  padding: 0.5em;
`;

const ViewSurveyPage = () => (
  <Container>
    <Header title="View" />
    <StyledGrid tabIndex="-1" className="keyNav">
      <ScrollPane>
        <StyledMainCanvas>
          <Panel>
            <Layout>
              <Section>
                <SectionTitle>Electronic questionnaire</SectionTitle>
                <SectionContent>
                  Opens the questionnaire, in a new browser tab, on the
                  Electronic questionnaire (EQ) platform to see the respondent’s
                  view of the questionnaire.
                </SectionContent>
                <InformationPanel>
                  The questionnaire cannot be opened in Electronic questionnaire
                  if there are unresolved validation errors.
                </InformationPanel>
              </Section>
              <Section>
                <SectionTitle>Extraction tool</SectionTitle>
                <SectionContent>
                  Opens the questionnaire in the Extraction tool. It will open
                  in a new browser tab. The extraction tool will display all the
                  questionnaire’s questions, answers and logic in one scrollable
                  page. This is ideal for reviewing the entire questionnaire on
                  one page. You can also view it as a question table which can
                  be downloaded as a CSV file.
                </SectionContent>
                <BorderedButton
                  variant="tertiary"
                  small
                  data-test="btn-open-in-extraction-tool"
                >
                  <IconText positionRight icon={viewIcon}>
                    Open in Extraction tool
                  </IconText>
                </BorderedButton>
                <OnsButton text="Open in Extraction tool" variant="inverse" />
              </Section>
            </Layout>
          </Panel>
        </StyledMainCanvas>
      </ScrollPane>
    </StyledGrid>
  </Container>
);

export default ViewSurveyPage;
