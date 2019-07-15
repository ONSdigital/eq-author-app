import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import { rgba } from "polished";
import timer from "utils/timer";
import { invoke } from "lodash";

const bgColor = rgba(colors.black, 0.9);

const StyledToast = styled.div`
  background-color: ${bgColor};
  padding: 1em;
  color: ${colors.white};
  font-size: 0.875rem;
  width: auto;
`;

export default class Toast extends React.Component {
  static propTypes = {
    timeout: PropTypes.number,
    onClose: PropTypes.func,
    children: PropTypes.node.isRequired,
    id: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    timeout: 0,
  };

  constructor(props) {
    super(props);

    if (props.timeout) {
      this.timer = timer(this.handleClose, props.timeout);
      this.timer.start();
    }
  }

  componentWillUnmount() {
    invoke(this.timer, "stop");
  }

  handleClose = () => {
    this.props.onClose(this.props.id);
  };

  handlePause = () => {
    invoke(this.timer, "pause");
  };

  handleResume = () => {
    invoke(this.timer, "resume");
  };

  render() {
    const { children, ...otherProps } = this.props;
    const child = React.Children.only(children);

    return (
      <StyledToast
        {...otherProps}
        onMouseEnter={this.handlePause}
        onMouseLeave={this.handleResume}
        onFocus={this.handlePause}
        onBlur={this.handleResume}
        data-test="toast"
      >
        {React.cloneElement(child, { onClose: this.handleClose })}
      </StyledToast>
    );
  }
}
