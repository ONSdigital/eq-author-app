import React from "react";
import PropTypes from "prop-types";

import EditorLayout from "components/EditorLayout";

// import Panel from "components/Panel";

const SubmissionLayout = ({ renderPanel }) => (
  <EditorLayout preview title="Submission" renderPanel={renderPanel} />
);

SubmissionLayout.propTypes = {
  // children: PropTypes.node.isRequired,
  renderPanel: PropTypes.func,
};

export default SubmissionLayout;
