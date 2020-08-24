import styled from "styled-components";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

const ScrollPane = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
`;

const StyledScrollPane = ({ children, scrollToTop = false, ...otherProps }) => {
  const history = useHistory();
  const ref = useRef();

  useEffect(() => {
    if (scrollToTop) {
      history.listen(() => {
        const node = ref.current;
        if (node) {
          node.scrollTop = 0;
        }
      });
    }
  });
  return (
    <ScrollPane ref={ref} {...otherProps}>
      {children}
    </ScrollPane>
  );
};

StyledScrollPane.propTypes = {
  children: PropTypes.node,
  scrollToTop: PropTypes.bool,
};

export default StyledScrollPane;
