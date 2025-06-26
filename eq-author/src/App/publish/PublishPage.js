import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { colors } from "constants/theme.js";

import Theme from "contexts/themeContext";

import PanelWrapper from "components/Panel";
import ScrollPane from "components/ScrollPane";
import Header from "components/EditorLayout/Header";

import Panel from "components-themed/panels";
import Button from "components-themed/buttons";

import PUBLISH_SCHEMA from "graphql/publishSchema.graphql";

import PublishHistory from "./GetPublishHistory";
import { useQuestionnaire } from "components/QuestionnaireContext";
import { useQCodeContext } from "components/QCodeContext";

import { ToastContext } from "components/Toasts";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledPanelWrapper = styled(PanelWrapper)`
  max-width: 97.5%;
  margin: 1.5em auto;
  padding: 1.5em;
`;

const Title = styled.h2`
  font-size: 1.4em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
  margin-bottom: 1em;
`;

const Content = styled.div`
  font-weight: 400;
  color: ${colors.text};
  margin-bottom: 1em;
`;

const StyledButton = styled(Button)`
  margin-top: 1em;
`;

const PublishPage = () => {
  const { questionnaire } = useQuestionnaire();
  const { showToast } = useContext(ToastContext);

  const [publishSchema] = useMutation(PUBLISH_SCHEMA, {
    refetchQueries: ["GetPublishHistory"],
    onCompleted: (data) => {
      const history = data?.publishSchema?.publishHistory;
      const latestEntry = history && history[history.length - 1];
      if (latestEntry && !latestEntry.success) {
        showToast("Publish failed");
      } else {
        showToast("Publish successful");
      }
    },
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishButtonClick = async () => {
    setIsPublishing(true);
    try {
      await publishSchema();
    } finally {
      setIsPublishing(false);
    }
  };

  const totalErrorCount = questionnaire?.totalErrorCount || 0;
  const { hasQCodeError } = useQCodeContext();

  return (
    <Theme themeName="onsLegacyFont">
      <Container data-test="publish-page-container">
        <Header title="Publish" />
        <ScrollPane>
          <StyledPanelWrapper>
            <Title>Publish questionnaire</Title>
            <Content>
              To launch a questionnaire in EQ for respondents to complete, it
              must first be published to the Collection Instrument Registry
              (CIR).
            </Content>
            <Content>
              A questionnaire can be published more than once. Published
              versions of a questionnaire cannot be accessed or edited in
              Author, only launched through EQ.
            </Content>
            <Panel variant="info" withLeftBorder>
              All validation errors related to content, settings, or Q Codes
              must be resolved before a questionnaire can be published.
            </Panel>
            <StyledButton
              variant="primary"
              onClick={handlePublishButtonClick}
              data-test="btn-publish-schema"
              disabled={totalErrorCount > 0 || hasQCodeError || isPublishing} // Disabled if there are any errors or if the publishSchema mutation is running
            >
              Publish questionnaire
            </StyledButton>
            <PublishHistory />
          </StyledPanelWrapper>
        </ScrollPane>
      </Container>
    </Theme>
  );
};

export default withRouter(PublishPage);
