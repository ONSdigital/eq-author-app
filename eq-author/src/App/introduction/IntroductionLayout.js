import React from "react";
import PropTypes from "prop-types";

import EditorLayout from "components/EditorLayout";

import Panel from "components/Panel";

const IntroductionLayout = ({ children }) => (
  <EditorLayout preview title="Questionnaire Introduction">
    <Panel>{children}</Panel>
  </EditorLayout>
);

IntroductionLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IntroductionLayout;
