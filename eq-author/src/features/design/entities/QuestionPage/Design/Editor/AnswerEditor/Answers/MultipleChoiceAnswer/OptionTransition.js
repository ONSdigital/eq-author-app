import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

const timeout = props => props.timeout;

const onExit = node => {
  const { height } = node.getBoundingClientRect();
  node.style.height = `${height}px`;
};

const OptionTransition = styled(CSSTransition).attrs({
  classNames: "option",
  onExit: () => onExit
})`
  position: relative;

  &.option-enter {
    opacity: 0;
    transform: scale(0.9);
    z-index: 200;
  }

  &.option-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: opacity ${timeout}ms ease-out,
      transform ${timeout}ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &.option-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.option-exit-active {
    opacity: 0;
    height: 0 !important;
    transform: scale(0.9);
    transition: opacity ${props => props.timeout / 2}ms ease-out,
      height ${props => props.timeout / 2}ms ease-in
        ${props => props.timeout / 2}ms,
      transform ${props => props.timeout / 2}ms ease-in;
  }
`;

OptionTransition.defaultProps = {
  timeout: 200
};

OptionTransition.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.element
};

export default OptionTransition;
