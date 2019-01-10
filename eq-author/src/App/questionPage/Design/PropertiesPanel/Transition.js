import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

const timeout = props => props.timeout;
const halfTimeout = props => props.timeout / 2;

const onExit = node => {
  const { height } = node.getBoundingClientRect();
  node.style.height = `${height}px`;
};

const Transition = styled(CSSTransition).attrs({
  classNames: "transition",
  onExit: () => onExit
})`
  &.transition-enter {
    opacity: 0;
  }

  &.transition-enter-active {
    opacity: 1;

    transition: opacity ${timeout}ms ease-out;
  }

  &.transition-exit {
    opacity: 1;
  }

  &.transition-exit-active {
    opacity: 0;

    height: 0 !important;
    transition: opacity ${halfTimeout}ms ease-out,
      height ${halfTimeout}ms ease-in ${halfTimeout}ms;
  }
`;

Transition.defaultProps = {
  in: false,
  timeout: 300
};

Transition.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.element
};

export default Transition;
