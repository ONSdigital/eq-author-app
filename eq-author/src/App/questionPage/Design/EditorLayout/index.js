import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import styled from "styled-components";
import Button from "components/buttons/Button";
import IconText from "components/IconText";
import MainCanvas from "components/MainCanvas";
import ScrollPane from "components/ScrollPane";
import PropertiesPanel from "App/questionPage/Design/PropertiesPanel";
import AddPage from "App/QuestionnaireDesignPage/icon-add-page.svg?inline";
import SavingIndicator from "components/SavingIndicator";
import { Grid, Column } from "components/Grid";

import Tabs from "./Tabs";

const Centered = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 4em;
`;

const Margin = styled.div`
  margin-top: 2em;
`;

const EditorLayout = ({
  children,
  onAddPage,
  page,
  design,
  preview,
  routing,
  ...otherProps
}) => (
  <Grid {...otherProps}>
    <Column cols={9} gutters={false}>
      <ScrollPane permanentScrollBar>
        <Margin>
          <MainCanvas>
            <SavingIndicator />
            <Tabs design={design} preview={preview} routing={routing}>
              {children}
            </Tabs>
          </MainCanvas>
        </Margin>
        {onAddPage && (
          <Centered>
            <Button
              variant="tertiary"
              small
              onClick={onAddPage}
              data-test="btn-add-page"
            >
              <IconText icon={AddPage}>Add question page</IconText>
            </Button>
          </Centered>
        )}
      </ScrollPane>
    </Column>
    <Column cols={3} gutters={false}>
      <PropertiesPanel page={page} />
    </Column>
  </Grid>
);

EditorLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onAddPage: PropTypes.func,
  page: CustomPropTypes.page,
  design: PropTypes.bool,
  preview: PropTypes.bool,
  routing: PropTypes.bool
};

export default EditorLayout;
