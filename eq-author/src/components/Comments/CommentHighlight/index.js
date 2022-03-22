import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

const CommentHighlight = ({ children }) => {
  const Highlight = styled.div`
    /* 
    Uses rbga to handle opacity - using CSS' opacity property also applies opacity to child elements
    Same colour as neonYellow (#F0F762)
    */
    background-color: rgba(240, 247, 98, 0.025);
    border: 2px solid ${({ theme }) => theme.colors.neonYellow};
    outline: 1px solid ${colors.commentHighlight};
    padding: 1em;
    margin-bottom: 1em;
  `;

  return <Highlight data-test="comment-highlight">{children}</Highlight>;
};

CommentHighlight.propTypes = {
  children: PropTypes.node,
};

export default CommentHighlight;
