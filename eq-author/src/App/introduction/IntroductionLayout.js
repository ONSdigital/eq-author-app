import React from "react";
import PropTypes from "prop-types";

import EditorLayout from "components/EditorLayout";

import Panel from "components/Panel";

const IntroductionLayout = ({ renderPanel, children }) => (
  <EditorLayout preview title="Introduction" renderPanel={renderPanel}>
    <Panel>{children}</Panel>
  </EditorLayout>
);

IntroductionLayout.propTypes = {
  children: PropTypes.node.isRequired,
  renderPanel: PropTypes.func,
};

export default IntroductionLayout;
