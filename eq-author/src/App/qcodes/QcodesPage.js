import React from "react";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import { Grid } from "components/Grid";
import MainCanvas from "components/MainCanvas";
import QcodesTable from "./QCodesTable";
import InfoIcon from "./icon-info.svg?inline";
import IconText from "components/IconText";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledGrid = styled(Grid)`
  overflow: hidden;
`;

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0 0.5em 0 1em;
  max-width: 80em;
`;

const Info = styled(IconText)`
  padding: 2em;
  justify-content: left;
`;

const QcodesPage = ({ match }) => {
  const questionnaireId = match.params.questionnaireId;
  return (
    <Container>
      <Header title="QCodes" />
      <Info icon={InfoIcon}>
        Qcodes are used to help send the information respondents enter into our
        questionnaires to downstream systems; please make sure these are all
        filled in before publishing.
      </Info>
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
