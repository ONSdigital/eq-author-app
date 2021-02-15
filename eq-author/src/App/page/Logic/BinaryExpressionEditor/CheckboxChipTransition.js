import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
import styled from "styled-components";

const timeout = (props) => props.timeout;
const halfTimeout = (props) => props.timeout / 2;

const handleExit = (node) => {
  const { height, width } = node.getBoundingClientRect();
  node.style.height = `${height}px`;
  node.style.width = `${width}px`;
};

const RoutingComponentTransition = styled(CSSTransition).attrs(() => ({
  classNames: "component",
  onExit: () => handleExit,
}))`
  position: relative;

  &.component-enter {
    opacity: 0;

    z-index: 200;
  }

  &.component-enter-active {
    opacity: 1;

    transition: opacity ${timeout}ms ease-out,
      transform ${timeout}ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &.component-exit {
    opacity: 1;
  }

  &.component-exit-active {
    opacity: 0;
    height: 0 !important;
    width: 0 !important;

    transition: opacity ${halfTimeout}ms ease-out,
      height ${halfTimeout}ms ease-in ${halfTimeout}ms,
      width ${halfTimeout}ms ease-in ${halfTimeout}ms,
      transform ${halfTimeout}ms ease-in;
  }
`;

RoutingComponentTransition.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.element,
};

RoutingComponentTransition.defaultProps = {
  timeout: 200,
};

export default RoutingComponentTransition;
