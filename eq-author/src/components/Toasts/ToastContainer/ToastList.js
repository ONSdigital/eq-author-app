import React from "react";
import { TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";
import styled from "styled-components";
import DefaultTransition from "./Transition";

const ToastList = styled.ol.attrs({
  "aria-live": "assertive",
  "aria-relevant": "additions removals",
  role: "alert",
})`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ToastItem = styled.li`
  padding: 0;
  padding-bottom: 0.5em;
  margin: 0;
  min-width: 10em;
`;

export default class ToastContainer extends React.Component {
  static propTypes = {
    transition: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    transition: DefaultTransition,
  };

  renderChild = (child) => {
    const { transition: Transition } = this.props;

    return (
      <Transition>
        <ToastItem data-test="toast-item">{child}</ToastItem>
      </Transition>
    );
  };

  render() {
    return (
      <TransitionGroup component={ToastList}>
        {React.Children.map(this.props.children, this.renderChild)}
      </TransitionGroup>
    );
  }
}
