import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import PropTypes from "prop-types";

const PopupTransition = styled(CSSTransition).attrs({
  classNames: "popup"
})`
  transform-origin: left center;
  transition: opacity ${props => props.timeout / 4}ms ease-in,
    transform ${props => props.timeout}ms cubic-bezier(0.175, 0.885, 0.32, 1.4);
  transform: scale(1);

  &.popup-enter {
    opacity: 0.01;
    transform: scale(0.6);
  }

  &.popup-enter-active {
    opacity: 1;
    transform: scale(1);
  }

  &.popup-exit {
    opacity: 1;
    transform: scale(1);
    transition: opacity ${props => props.timeout / 4}ms ease-in,
      transform ${props => props.timeout}ms ease-in;
  }

  &.popup-exit-active {
    opacity: 0.01;
    transform: scale(0.6);
  }
`;

PopupTransition.defaultProps = {
  in: false,
  timeout: 200
};

PopupTransition.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.element
};

export default PopupTransition;
