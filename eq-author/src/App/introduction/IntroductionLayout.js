import React from "react";
import PropTypes from "prop-types";
import { Titled } from "react-titled";
import styled from "styled-components";

import EditorLayout from "App/page/Design/EditorLayout";

const Padding = styled.div`
  padding: 2em 0 0;
  position: relative;
  width: 100%;
`;

const setTitle = title => `Introduction — ${title}`;

const IntroductionLayout = ({ children }) => (
  <Titled title={setTitle}>
    <EditorLayout preview>
      <Padding>{children}</Padding>
    </EditorLayout>
  </Titled>
);

IntroductionLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IntroductionLayout;
