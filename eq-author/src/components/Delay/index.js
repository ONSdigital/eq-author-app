import React from "react";
import PropTypes from "prop-types";

class Delay extends React.Component {
  static propTypes = {
    delay: PropTypes.number,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    delay: 250,
  };

  state = {
    ready: false,
  };

  componentDidMount() {
    this.timer = setTimeout(
      () => this.setState({ ready: true }),
      this.props.delay
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return this.state.ready ? this.props.children : null;
  }
}

export default Delay;
