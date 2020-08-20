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

const StyledScrollPane = ({ children, ...otherProps }) => {
  const history = useHistory();
  const ref = useRef();
  const node = ref.current;

  useEffect(() => {
    history.listen(() => {
      if (node) {
        node.scrollTop = 0;
      }
    });
  });
  return (
    <ScrollPane ref={ref} {...otherProps}>
      {children}
    </ScrollPane>
  );
};

StyledScrollPane.propTypes = {
  children: PropTypes.node,
};

export default StyledScrollPane;
