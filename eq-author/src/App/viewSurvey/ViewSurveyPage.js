import React from "react";
import styled from "styled-components";

import { useParams } from "react-router-dom";
import config from "config";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Grid } from "components/Grid";
import { colors } from "constants/theme";
import MainCanvas from "components/MainCanvas";

import { Panel, InformationPanel } from "components/Panel";
import ExternalLinkButton from "components/buttons/ExternalLinkButton";

import { useQuestionnaire } from "components/QuestionnaireContext";

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

const ViewSurveyPage = () => {
  const params = useParams();
  const previewUrl = `${config.REACT_APP_LAUNCH_URL}/${params.questionnaireId}`;
  const extractionUrl = `${config.REACT_APP_EXTRACTION_URL}?qid=${params.questionnaireId}`;
  const { questionnaire } = useQuestionnaire();
  const formTypeErrorCount =
    questionnaire?.themeSettings?.validationErrorInfo?.errors.filter(
      ({ errorCode }) => errorCode === "ERR_FORM_TYPE_FORMAT"
    ).length + questionnaire?.validationErrorInfo?.totalCount;
  const totalErrorCount = questionnaire?.totalErrorCount || 0;
  const totalErrorCountNoFormType = totalErrorCount - formTypeErrorCount;
  return (
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
                    Electronic questionnaire (EQ) platform to see the
                    respondent’s view of the questionnaire.
                  </SectionContent>
                  <InformationPanel>
                    The questionnaire cannot be opened in Electronic
                    questionnaire if there are unresolved validation errors.
                  </InformationPanel>
                  <ExternalLinkButton
                    text="Open in Electronic questionnaire"
                    url={previewUrl}
                    disabled={totalErrorCountNoFormType > 0}
                  />
                </Section>
                <Section>
                  <SectionTitle>Extraction tool</SectionTitle>
                  <SectionContent>
                    Opens the questionnaire in the Extraction tool. It will open
                    in a new browser tab. The extraction tool will display all
                    the questionnaire’s questions, answers and logic in one
                    scrollable page. This is ideal for reviewing the entire
                    questionnaire on one page. You can also view it as a
                    question table which can be downloaded as a CSV file.
                  </SectionContent>
                  <ExternalLinkButton
                    text="Open in Extraction tool"
                    url={extractionUrl}
                  />
                </Section>
              </Layout>
            </Panel>
          </StyledMainCanvas>
        </ScrollPane>
      </StyledGrid>
    </Container>
  );
};

export default ViewSurveyPage;
