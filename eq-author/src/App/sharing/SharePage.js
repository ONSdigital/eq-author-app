import React from "react";
import CustomPropTypes from "custom-prop-types";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";

import Panel from "components/Panel";
import ShareContent from "./SharePageContent";

import { Container, StyledGrid, StyledMainCanvas } from "./styles/SharePage";

const propTypes = {
  SharePage: {
    match: CustomPropTypes.match.isRequired,
  },
};

const SharePage = (props) => {
  const { questionnaireId } = props.match.params;
  return (
    <Container>
      <Header title="Sharing" />
      <StyledGrid>
        <ScrollPane data-test="sharing-page-content">
          <StyledMainCanvas>
            <Panel>
              <ShareContent questionnaireId={questionnaireId} />
            </Panel>
          </StyledMainCanvas>
        </ScrollPane>
      </StyledGrid>
    </Container>
  );
};

SharePage.propTypes = propTypes.SharePage;

export default SharePage;
