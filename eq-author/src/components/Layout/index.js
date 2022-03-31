import React from "react";
import { Titled } from "react-titled";
import PropTypes from "prop-types";
import styled from "styled-components";

import ScrollPane from "components/ScrollPane";
import BaseLayout from "components/BaseLayout";
import Theme from "contexts/themeContext";

import Header from "components-themed/Header/index.js";
import { ReactComponent as Logo } from "assets/ons-logo.svg";
import Footer from "components-themed/Footer";
import { Grid, Column } from "components/Grid";

const GridAuto = styled(Grid)`
  height: auto;
  min-height: 100%;
  margin-bottom: -95px;
  padding-bottom: 6.5em;
`;

const Layout = ({ title, children }) => (
  <Titled title={() => title}>
    <BaseLayout>
      <Theme themeName={"ons"}>
        <ScrollPane>
          <Header
            variant="Internal"
            headerDescription="Questionnaire builder"
            logo={<Logo />}
            centerCols={9}
          >
            {title}
          </Header>
          <GridAuto horizontalAlign="center">
            <Column cols={9}>{children}</Column>
          </GridAuto>
          <Footer centerCols={9} />
        </ScrollPane>
      </Theme>
    </BaseLayout>
  </Titled>
);

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Layout;
