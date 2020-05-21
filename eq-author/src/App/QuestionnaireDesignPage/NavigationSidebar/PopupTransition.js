import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import PropTypes from "prop-types";

const PopupTransition = styled(CSSTransition).attrs({
  classNames: "popup",
})`
  opacity: 1;
  transform: translate(0, 0%);
  transition: all 0.6s -0.1s;
  transform-origin: top center;

  &.popup-enter {
    transform: translate(0, -100%);
    transition: all 0.6s 0s;
    transform-origin: top center;
  }

  &.popup-exit {
    opacity: 0.9;
    transform: translate(0, -130%);
    transition: all 0.6s 0s;
    transform-origin: top center;
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
