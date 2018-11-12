import React from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import PropTypes from "prop-types";

const Animated = styled.div`
  transform-origin: bottom left;
  transition: transform ${props => props.duration / 2}ms;

  > * > * {
    transition: opacity ${props => props.duration / 2}ms
      ${props => props.duration / 2}ms;
  }

  &.scale-enter {
    transform: scale(0);

    > * > * {
      opacity: 0;
    }
  }

  &.scale-enter-active {
    transform: scale(1);

    > * > * {
      opacity: 1;
    }
  }

  &.scale-exit {
    transform: scale(1);
    transition: transform ${props => props.duration / 2}ms
      ${props => props.duration / 2}ms;

    > * > * {
      transition: opacity ${props => props.duration / 2}ms;
      opacity: 1;
    }
  }

  &.scale-exit-active {
    transform: scale(0);

    > * > * {
      opacity: 0;
    }
  }
`;

class ScaleTransition extends React.Component {
  static defaultProps = {
    in: false,
    duration: 250
  };

  static propTypes = {
    duration: PropTypes.number,
    children: PropTypes.element
  };

  render() {
    const { duration, children, ...otherProps } = this.props;
    return (
      <CSSTransition timeout={duration} {...otherProps} classNames="scale">
        <Animated duration={duration}>{children}</Animated>
      </CSSTransition>
    );
  }
}

export default ScaleTransition;
