import React from "react";
import { Titled } from "react-titled";
import PropTypes from "prop-types";

import BaseLayout from "components/BaseLayout";
import MainCanvas from "components/MainCanvas";

import Header from "./Header";

const Layout = ({ title, children }) => (
  <Titled title={() => title}>
    <BaseLayout>
      <Header title={title} />
      <div>
        <MainCanvas maxWidth="70em">{children}</MainCanvas>
      </div>
    </BaseLayout>
  </Titled>
);

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Layout;
