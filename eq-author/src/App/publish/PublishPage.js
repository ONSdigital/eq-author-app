import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import Theme from "contexts/themeContext";

import PanelWrapper from "components/Panel";
import ScrollPane from "components/ScrollPane";
import Header from "components/EditorLayout/Header";

import Panel from "components-themed/panels";
import Button from "components-themed/buttons";

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

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const PublishPage = () => {
  return (
    <Theme themeName="ons">
      <Container>
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
              All validation errors related to content, settings or Q Codes must
              be resolved before a questionnaire can be published.
            </Panel>
            <StyledButton variant="primary">Publish questionnaire</StyledButton>
            <HorizontalSeparator />
            <Title>Publishing history</Title>
            <Content>
              No versions of this questionnaire have been published
            </Content>
          </StyledPanelWrapper>
        </ScrollPane>
      </Container>
    </Theme>
  );
};

export default withRouter(PublishPage);
