import React from "react";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import Button from "components/buttons/Button";
import FadeTransition from "components/transitions/FadeTransition";
import { Column } from "components/Grid";

const MainContainer = styled.div`
  padding: 2em 3em;
  min-height: 30em;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1 1 auto;
  display: flex;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TabPanel = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ContentWrapper = ({ onClose, children }) => (
  <Column cols={9} gutters={false}>
    <MainContainer>
      <Content>
        <TabPanel>
          <TransitionGroup component={Content}>
            <FadeTransition appear enter exit={false}>
              {children}
            </FadeTransition>
          </TransitionGroup>
        </TabPanel>
      </Content>
      <Buttons>
        <Button onClick={onClose} variant="primary" data-test="btn-done">
          Done
        </Button>
      </Buttons>
    </MainContainer>
  </Column>
);

ContentWrapper.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ContentWrapper;
