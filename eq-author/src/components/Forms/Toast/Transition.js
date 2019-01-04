import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

const ToastTransition = styled(CSSTransition).attrs({
  classNames: "toast"
})`
  transition-property: transform, opacity;
  transition-duration: ${props => props.timeout * 0.66}ms;

  &.toast-enter {
    opacity: 0;
    transform: translateY(50%);
    transition-timing-function: cubic-bezier(0.73, 0.02, 0.32, 1.49);
    transition-delay: ${props => props.timeout * 0.33}ms;
  }

  &.toast-enter.toast-enter-active {
    opacity: 1;
    transform: translateY(0);
  }

  &.toast-exit {
    opacity: 1;
    transform: translateY(0);
    transition-timing-function: cubic-bezier(0.75, -0.44, 0.24, 1);
  }

  &.toast-exit.toast-exit-active {
    opacity: 0;
    transform: translateY(-50%);
  }
`;

ToastTransition.defaultProps = {
  in: false,
  timeout: 500
};

ToastTransition.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.element
};

export default ToastTransition;
