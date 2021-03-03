import React from "react";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
import styled from "styled-components";

const AnimatedSection = styled.div`
  position: relative;

  &.fade-enter,
  &.fade-exit {
    opacity: 0.25;
    transform: translateX(-50px);
    z-index: 200;
  }

  &.fade-enter.fade-enter-active {
    opacity: 1;
    z-index: 200;
    transform: translateX(0);
    transition: opacity ${(props) => props.duration}ms ease-out,
      transform ${(props) => props.duration}ms
        cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
`;

const SlideTransition = ({ children, duration, ...otherProps }) => (
  <CSSTransition
    {...otherProps}
    timeout={duration}
    enter
    exit={false}
    classNames="fade"
  >
    <AnimatedSection duration={duration}>{children}</AnimatedSection>
  </CSSTransition>
);

SlideTransition.propTypes = {
  duration: PropTypes.number,
  children: PropTypes.element,
};

SlideTransition.defaultProps = {
  duration: 300,
};

export default SlideTransition;
