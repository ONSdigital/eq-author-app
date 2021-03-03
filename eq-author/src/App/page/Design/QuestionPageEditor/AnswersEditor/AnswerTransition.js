import React from "react";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
import styled from "styled-components";

const timeout = (props) => props.timeout;
const halfTimeout = (props) => props.timeout / 2;

const handleExit = (node) => {
  const { height } = node.getBoundingClientRect();
  node.style.height = `${height}px`;
};

const AnswerTransitionWrapper = styled(CSSTransition).attrs(() => ({
  classNames: "answer",
  onExit: () => handleExit,
}))`
  position: relative;

  &.answer-enter {
    opacity: 0;
    transform: scale(0.9);
    z-index: 200;
  }

  &.answer-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: opacity ${timeout}ms ease-out,
      transform ${timeout}ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &.answer-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.answer-exit-active {
    opacity: 0;
    height: 0 !important;
    transform: scale(0.9);
    transition: opacity ${halfTimeout}ms ease-out,
      height ${halfTimeout}ms ease-in ${halfTimeout}ms,
      transform ${halfTimeout}ms ease-in;
  }
`;

const AnswerTransition = ({ children, ...otherProps }) => {
  return (
    <AnswerTransitionWrapper {...otherProps}>
      <div>{children}</div>
    </AnswerTransitionWrapper>
  );
};

AnswerTransition.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.element,
};

AnswerTransition.defaultProps = {
  timeout: 200,
};

export default AnswerTransition;
