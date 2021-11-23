import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Theme from "contexts/themeContext";

import { lostConnection, gainConnection } from "redux/saving/actions";
export class UnconnectedApp extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    gainConnection: PropTypes.func.isRequired,
    lostConnection: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    window.addEventListener("online", this.props.gainConnection);
    window.addEventListener("offline", this.props.lostConnection);
  };

  componentWillUnmount = () => {
    window.removeEventListener("online", this.props.gainConnection);
    window.removeEventListener("offline", this.props.lostConnection);
  };

  render() {
    return <Theme>{this.props.children}</Theme>;
  }
}

export default connect(null, {
  lostConnection,
  gainConnection,
})(UnconnectedApp);
