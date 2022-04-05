import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { Titled } from "react-titled";
import { useMe } from "App/MeContext";
import hasUnreadComments from "utils/hasUnreadComments";

import { colors } from "constants/theme";

import Button from "components/buttons/Button";
import IconText from "components/IconText";
import MainCanvas from "components/MainCanvas";
import ScrollPane from "components/ScrollPane";
import { Grid, Column } from "components/Grid";

import AddPage from "assets/icon-add-page.svg?inline";

import Tabs from "./Tabs";
import Header from "./Header";

const Centered = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 4em;
  border-bottom: 1px solid ${colors.bordersLight};
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
  border-bottom: 1px solid ${colors.bordersLight};
`;

const StyledGrid = styled(Grid)`
  height: auto;
`;

const StyledColumn = styled(Column)`
  height: auto;
  &:focus-visible {
    border: 3px solid ${colors.focus};
    margin: 0;
    outline: none;
  }
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
  validationErrorInfo,
  comments,
  ...otherProps
}) => {
  const { me } = useMe();

  return (
    <Titled title={(existingTitle) => `${existingTitle} - ${title}`}>
      <Container>
        <Header title={title}>
          <Tabs
            design={design}
            preview={preview}
            logic={logic}
            validationErrorInfo={validationErrorInfo}
            unreadComment={hasUnreadComments(comments, me.id)}
          />
        </Header>
        <ScrollPane scrollToTop>
          <StyledGrid {...otherProps}>
            <StyledColumn
              cols={singleColumnLayout ? 12 : 9}
              gutters={false}
              tabIndex="-1"
              className="keyNav"
            >
              <Margin>
                <MainCanvas maxWidth={mainCanvasMaxWidth}>
                  {children}
                </MainCanvas>
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
            </StyledColumn>
            {singleColumnLayout ? null : (
              <Column cols={3} gutters={false}>
                <PanelWrapper data-test="right-hand-panel">
                  {renderPanel ? renderPanel() : null}
                </PanelWrapper>
              </Column>
            )}
          </StyledGrid>
        </ScrollPane>
      </Container>
    </Titled>
  );
};

EditorLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onAddQuestionPage: PropTypes.func,
  design: PropTypes.bool,
  preview: PropTypes.bool,
  logic: PropTypes.bool,
  singleColumnLayout: PropTypes.bool,
  mainCanvasMaxWidth: PropTypes.string,
  title: PropTypes.string,
  renderPanel: PropTypes.func,
  validationErrorInfo: CustomPropTypes.validationErrorInfo,
  comments: PropTypes.array, //eslint-disable-line
};

export default EditorLayout;
