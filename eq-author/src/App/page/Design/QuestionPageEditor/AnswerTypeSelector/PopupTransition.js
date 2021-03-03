import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import PropTypes from "prop-types";

const timeout = (props) => props.timeout;
const quarterTimeout = (props) => props.timeout / 4;

const PopupTransition = styled(CSSTransition).attrs({
  classNames: "popup",
})`
  transform-origin: center bottom;
  transition: opacity ${quarterTimeout}ms ease-in,
    transform ${timeout}ms cubic-bezier(0.175, 0.885, 0.32, 1.4);
  transform: scale(1) translateY(0);

  &.popup-enter {
    opacity: 0.01;
    transform: scale(0.8) translateY(20px);
  }

  &.popup-enter-active {
    opacity: 1;
    transform: scale(1) translateY(0);
  }

  &.popup-exit {
    opacity: 1;
    transform: scale(1) translateY(0);
    transition: opacity ${quarterTimeout}ms ease-in,
      transform ${timeout}ms ease-in;
  }

  &.popup-exit-active {
    opacity: 0.01;
    transform: scale(0.8) translateY(20px);
  }
`;

PopupTransition.defaultProps = {
  in: false,
  timeout: 200,
};

PopupTransition.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.element,
};

export default PopupTransition;
