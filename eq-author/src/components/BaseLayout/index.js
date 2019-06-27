import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Titled } from "react-titled";

import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";

import OfflineBanner from "components/OfflineBanner";
import ToastContainer from "components/ToastContainer";
import Header from "components/Header";

import PermissionsBanner from "./PermissionsBanner";
import App from "./App";

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
  min-height: 0;
`;

const BaseLayout = ({ children, title, questionnaire }) => (
  <Titled title={() => title}>
    <App>
      <Wrapper>
        <Header questionnaire={questionnaire} title={title} />
        <OfflineBanner />
        <PermissionsBanner questionnaire={questionnaire} />
        <Main>{children}</Main>
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
  questionnaire: CustomPropTypes.questionnaire,
};

export default BaseLayout;
