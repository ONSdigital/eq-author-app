import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

const timeout = props => props.timeout;
const halfTimeout = props => props.timeout / 2;

const onExit = node => {
  const { height } = node.getBoundingClientRect();
  node.style.height = `${height}px`;
};

const NavItemTransition = styled(CSSTransition).attrs({
  classNames: "nav-item",
  onExit: () => onExit
})`
  &.nav-item-enter {
    opacity: 0;
    transform: translateX(-20px);
  }

  &.nav-item-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity ${timeout}ms ease-out, transform ${timeout}ms ease-out;
  }

  &.nav-item-exit {
    opacity: 1;
    transform: translateX(0);
  }

  &.nav-item-exit-active {
    opacity: 0;
    transform: translateX(-20px);
    height: 0 !important;
    transition: opacity ${halfTimeout}ms ease-out,
      transform ${halfTimeout}ms ease-in,
      height ${halfTimeout}ms ease-in ${halfTimeout}ms;
  }
`;

NavItemTransition.defaultProps = {
  in: false,
  timeout: 300
};

NavItemTransition.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.element
};

export default NavItemTransition;
