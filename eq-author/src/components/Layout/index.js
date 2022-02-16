import React from "react";
import { Titled } from "react-titled";
import PropTypes from "prop-types";

import ScrollPane from "components/ScrollPane";
import BaseLayout from "components/BaseLayout";
import MainCanvas from "components/MainCanvas";

import Header from "components-themed/Header";
import Theme from "contexts/themeContext";
import Footer from "components-themed/Footer";
// import Header from "./Header";

import { ReactComponent as Logo } from "assets/ons-logo.svg";
//probably need to chnage this to work with a actual sign out link
const signOut = (
  <ul>
    <li>
      <a href="">Sign Out</a>
    </li>
  </ul>
);

const Layout = ({ title, children }) => (
  <Titled title={() => title}>
    <BaseLayout>
      {/* <Header title={title}/> */}
      {/* probs need to revert back to original - clashes with shanes */}
      <Theme themeName={"ons"}>
        <Header
          variant="Internal"
          logo={<Logo />}
          headerDescription="Questionnaire builder"
          headerTopContent={signOut}
        >
          {" "}
          Author (GCP){" "}
        </Header>
      </Theme>
      <ScrollPane>
        <MainCanvas maxWidth="70em">{children}</MainCanvas>
      </ScrollPane>
      <Theme themeName={"ons"}>
        <Footer />
      </Theme>
    </BaseLayout>
  </Titled>
);

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Layout;
