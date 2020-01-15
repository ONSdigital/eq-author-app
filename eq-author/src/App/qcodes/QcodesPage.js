import React from "react";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Grid } from "components/Grid";
import MainCanvas from "components/MainCanvas";
import QcodesTable from "./QCodesTable";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledGrid = styled(Grid)`
  overflow: hidden;
  padding-top: 64px;
`;

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0 0.5em 0 1em;
  max-width: 80em;
`;

const QcodesPage = ({ match }) => {
  const questionnaireId = match.params.questionnaireId;
  return (
    <Container>
      <Header title="QCodes" />
      <StyledGrid>
        <ScrollPane permanentScrollBar data-test="metadata-modal-content">
          <StyledMainCanvas>
            <QcodesTable questionnaireId={questionnaireId} />
          </StyledMainCanvas>
        </ScrollPane>
      </StyledGrid>
    </Container>
  );
};

QcodesPage.propTypes = {
  match: CustomPropTypes.match.isRequired,
};

export default QcodesPage;
