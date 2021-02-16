import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
import styled from "styled-components";

const ExpansionTransition = styled(CSSTransition).attrs({
  classNames: "expansion",
})`
  transition-property: height;
  transition-duration: ${(props) => props.timeout}ms;
  transition-timing-function: ease-in-out;

  &.expansion-enter {
    height: 0;
  }

  &.expansion-enter.expansion-enter-active {
    height: ${(props) => props.finalHeight};
  }

  &.expansion-exit {
    height: ${(props) => props.finalHeight};
  }

  &.expansion-exit.expansion-exit-active {
    height: 0;
  }
`;

ExpansionTransition.defaultProps = {
  in: false,
  timeout: 250,
  finalHeight: "1em",
};

ExpansionTransition.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.element,
  finalHeight: PropTypes.string,
};

export default ExpansionTransition;
