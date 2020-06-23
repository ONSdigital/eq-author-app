import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { Titled } from "react-titled";

import { colors } from "constants/theme";

import Button from "components/buttons/Button";
import IconText from "components/IconText";
import MainCanvas from "components/MainCanvas";
import ScrollPane from "components/ScrollPane";
import { Grid, Column } from "components/Grid";

import AddPage from "App/QuestionnaireDesignPage/icon-add-page.svg?inline";

import Tabs from "./Tabs";
import Header from "./Header";

const Centered = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 4em;
`;

const Margin = styled.div`
  margin-top: 1.2em;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PanelWrapper = styled.div`
  background: ${colors.white};
  width: 100%;
  height: 100%;
  border-left: 1px solid ${colors.bordersLight};
`;

const StyledGrid = styled(Grid)`
  overflow: hidden;
`;

const EditorLayout = ({
  children,
  onAddQuestionPage,
  title,
  design,
  preview,
  logic,
  singleColumnLayout,
  mainCanvasMaxWidth,
  renderPanel,
  ...otherProps
}) => (
  <Titled title={existingTitle => `${existingTitle} - ${title}`}>
    <Container>
      <Header title={title}>
        <Tabs design={design} preview={preview} logic={logic} />
      </Header>
      <StyledGrid {...otherProps}>
        <Column cols={singleColumnLayout ? 12 : 9} gutters={false}>
          <ScrollPane permanentScrollBar>
            <Margin>
              <MainCanvas maxWidth={mainCanvasMaxWidth}>{children}</MainCanvas>
            </Margin>
            {onAddQuestionPage && (
              <Centered>
                <Button
                  variant="tertiary"
                  small
                  onClick={onAddQuestionPage}
                  data-test="btn-add-page"
                >
                  <IconText icon={AddPage}>Add question page</IconText>
                </Button>
              </Centered>
            )}
          </ScrollPane>
        </Column>
        {singleColumnLayout ? null : (
          <Column cols={3} gutters={false}>
            <PanelWrapper>{renderPanel ? renderPanel() : null}</PanelWrapper>
          </Column>
        )}
      </StyledGrid>
    </Container>
  </Titled>
);

EditorLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onAddQuestionPage: PropTypes.func,
  page: CustomPropTypes.page,
  design: PropTypes.bool,
  preview: PropTypes.bool,
  logic: PropTypes.bool,
  singleColumnLayout: PropTypes.bool,
  mainCanvasMaxWidth: PropTypes.string,
  title: PropTypes.string,
  renderPanel: PropTypes.func,
};

export default EditorLayout;
