import React from "react";
import styled from "styled-components";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Grid } from "components/Grid";
import { colors } from "constants/theme";
import MainCanvas from "components/MainCanvas";
import QcodesTable from "./QCodesTable";
import { InformationPanel } from "components/Panel";
import Panel from "components-themed/panels";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledGrid = styled(Grid)`
  overflow: hidden;
  padding-top: 0em;
  &:focus-visible {
    border: 3px solid ${colors.focus};
    margin: 0;
    outline: none;
  }
`;

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0 0.5em 0 1em;
  max-width: 80em;
`;

const Padding = styled.div`
  margin: 2em auto 1em;
  width: 100%;
  padding: 0 0.5em 0 1em;
  max-width: 80em;
`;

const QcodesPage = () => (
  <Container data-test="qcodes-page-container">
    <Header title="Q Codes and values" />
    <Padding>
      <InformationPanel>
        Unique Q codes must be assigned to each answer type.
        <br /> <br />
        Unique values must be assigned to allow downstream processing of
        checkbox, radio and select answer labels.
      </InformationPanel>
      <Panel variant="warning">
        For live or ongoing surveys, only change the Q code or value if the
        context of the question or answer label has changed.
      </Panel>
    </Padding>
    <StyledGrid tabIndex="-1" className="keyNav">
      <ScrollPane>
        <StyledMainCanvas>
          <QcodesTable />
        </StyledMainCanvas>
      </ScrollPane>
    </StyledGrid>
  </Container>
);

export default QcodesPage;
