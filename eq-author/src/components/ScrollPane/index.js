import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";
import { darken } from "polished";
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

export const ScrollPaneCSS = css`
  -webkit-background-clip: text;
  transition: background-color 0.2s;

  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    box-shadow: none;
    background-color: ${colors.lightGrey};
    transition: background-color 0.2s;
  }

  ::-webkit-scrollbar-track {
    border-radius: 0;
    box-shadow: none;
    background: rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  > :first-child {
    backface-visibility: hidden !important;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: ${darken(0.1, colors.lightGrey)};
    }
  }
`;

const ScrollPane = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: ${props => (props.permanentScrollBar ? "scroll" : "auto")};
  position: relative;

  ${ScrollPaneCSS}
`;

ScrollPane.propTypes = {
  permanentScrollBar: PropTypes.bool,
};

ScrollPane.defaultProps = {
  permanentScrollBar: false,
};

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
