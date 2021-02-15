import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

const FadeTransition = styled(CSSTransition).attrs({
  classNames: "fade",
})`
  transition-property: opacity;
  transition-duration: ${(props) => props.timeout}ms;
  transition-timing-function: ease-in-out;

  &.fade-enter,
  &.fade-appear {
    opacity: 0;
  }

  &.fade-enter.fade-enter-active,
  &.fade-appear.fade-appear-active {
    opacity: 1;
  }

  &.fade-exit {
    opacity: 1;
  }

  &.fade-exit.fade-exit-active {
    opacity: 0;
  }
`;

FadeTransition.defaultProps = {
  in: false,
  timeout: 250,
};

FadeTransition.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.element,
};

export default FadeTransition;
