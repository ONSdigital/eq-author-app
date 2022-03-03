import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

// ! Test styling - to be changed
const CommentHighlight = ({ children }) => {
  const StyledPanel = styled.div`
    /* background-color: ${colors.green}; */
    border: 0;
    border-radius: 0;
    padding: 1em;
    margin: 1em 0;
    border-left: 10px solid ${colors.blue};

    p {
      margin: 0;
    }
  `;

  return <StyledPanel>{children}</StyledPanel>;
};

CommentHighlight.propTypes = {
  children: PropTypes.node,
};

export default CommentHighlight;
