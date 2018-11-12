import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import App from "components/App";
import Header from "components/Header";
import ScrollPane from "components/ScrollPane";
import { Titled } from "react-titled";

import ConnectedOfflineBanner from "components/OfflineBanner";

import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";

import ToastContainer from "containers/ToastContainer";

const Wrapper = styled.div`
  background-color: ${colors.lighterGrey};
  height: 100vh;
  min-width: 80em;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.4em;
  font-weight: 700;
  margin: 2em 0;
  text-align: center;
`;

const defaultTitle = () => "Author";

const BaseLayout = ({ children, title, questionnaire }) => (
  <Titled title={defaultTitle}>
    <App>
      <Wrapper>
        <Header questionnaire={questionnaire} />
        <ConnectedOfflineBanner />
        <Main>
          {title ? (
            <ScrollPane>
              <Title>{title}</Title>
              {children}
            </ScrollPane>
          ) : (
            children
          )}
        </Main>
        {ReactDOM.createPortal(
          <ToastContainer />,
          document.getElementById("toast")
        )}
      </Wrapper>
    </App>
  </Titled>
);

BaseLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  questionnaire: CustomPropTypes.questionnaire
};

export default BaseLayout;
