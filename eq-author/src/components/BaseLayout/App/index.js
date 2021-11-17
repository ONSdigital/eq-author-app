import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createGlobalStyle } from "styled-components";
import Theme from "contexts/themeContext";

import { lostConnection, gainConnection } from "redux/saving/actions";

const GlobalStyle = createGlobalStyle`
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
    color: ${({ theme }) => theme.colors.text};
  }

  input,
  select,
  textarea,
  button {
    font-family: inherit;
    -webkit-font-smoothing: inherit;
  }

  a {
    color: ${({ theme }) => theme.colors.blue};

    &:hover {
      text-decoration: none;
    }
  }
`;

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
    return (
      <Theme>
        {this.props.children} <GlobalStyle />
      </Theme>
    );
  }
}

export default connect(null, {
  lostConnection,
  gainConnection,
})(UnconnectedApp);
