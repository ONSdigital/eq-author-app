import React from "react";
import PropTypes from "prop-types";

import EditorLayout from "components/EditorLayout";

import Panel from "components/Panel";

const SubmissionLayout = ({ renderPanel, children }) => (
  <EditorLayout preview title="Submission page" renderPanel={renderPanel}>
    <Panel>{children}</Panel>
  </EditorLayout>
);

SubmissionLayout.propTypes = {
  children: PropTypes.node.isRequired,
  renderPanel: PropTypes.func,
};

export default SubmissionLayout;
