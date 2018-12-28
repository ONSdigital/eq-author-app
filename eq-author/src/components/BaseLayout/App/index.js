import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { injectGlobal, ThemeProvider } from "styled-components";
import theme, { colors } from "constants/theme";

import { lostConnection, gainConnection } from "redux/saving/actions";

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  html,
  body {
    height: 100%;
    width: 100%;
    font-size: 1em;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: 'Lato', sans-serif;
    overflow: hidden;
    color: ${colors.text};
  }

  input,
  select,
  textarea,
  button {
    font-family: inherit;
    -webkit-font-smoothing: inherit;
  }

  a {
    color: ${colors.blue};

    &:hover {
      text-decoration: none;
    }
  }
`;

export class UnconnectedApp extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    gainConnection: PropTypes.func.isRequired,
    lostConnection: PropTypes.func.isRequired
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
    return <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>;
  }
}

export default connect(
  null,
  {
    lostConnection,
    gainConnection
  }
)(UnconnectedApp);
