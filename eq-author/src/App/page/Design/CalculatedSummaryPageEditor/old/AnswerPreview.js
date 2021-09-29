import React from "react";
import PropType from "prop-types";
import styled from "styled-components";
import { colors, focusStyle } from "constants/theme";
import Truncated from "components/Truncated";

import { ReactComponent as IconClose } from "assets/icon-close.svg";

const Wrapper = styled.div`
  background: ${colors.primary};
  color: white;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
`;

const Title = styled(Truncated)`
  padding: 0.3em 0 0.3em 0.5em;
  line-height: 1.3;
`;

const CloseButton = styled.button`
  background: transparent;
  padding: 0;
  margin: 0;
  border: none;
  cursor: pointer;

  svg {
    width: 2em;
    height: 2em;
    vertical-align: middle;
  }

  svg {
    g,
    path,
    polygon {
      fill: ${colors.white};
    }
  }

  &:hover {
    svg {
      g,
      path,
      polygon {
        fill: ${colors.highlightBlue};
      }
    }
  }

  &:focus {
    ${focusStyle}
  }
`;

const AnswerPreview = ({ children, onRemove }) => (
  <Wrapper>
    <Title>{children}</Title>

    <CloseButton data-test="remove-answer-button" onClick={onRemove}>
      <IconClose />
    </CloseButton>
  </Wrapper>
);

AnswerPreview.propTypes = {
  onRemove: PropType.func.isRequired,
  children: PropType.node.isRequired,
};

export default AnswerPreview;
