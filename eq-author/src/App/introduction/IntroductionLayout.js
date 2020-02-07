import React from "react";
import PropTypes from "prop-types";

import EditorLayout from "components/EditorLayout";
import CommentsPanel from "components/CommentsPanel";

import Panel from "components/Panel";

const IntroductionLayout = ({ children }) => {
  return (
    <EditorLayout
      preview
      title="Questionnaire Introduction"
      renderPanel={() => <CommentsPanel />}
    >
      <Panel>{children}</Panel>
    </EditorLayout>
  );
};

IntroductionLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IntroductionLayout;
