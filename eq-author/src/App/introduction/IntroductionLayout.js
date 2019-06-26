import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import EditorLayout from "components/EditorLayout";

const Padding = styled.div`
  padding: 2em 0 0;
  position: relative;
  width: 100%;
`;

const IntroductionLayout = ({ children }) => (
  <EditorLayout preview title="Questionnaire Introduction">
    <Padding>{children}</Padding>
  </EditorLayout>
);

IntroductionLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IntroductionLayout;
