import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import theme, { colors } from "constants/theme";
import { useNetworkActivityContext } from "components/NetworkActivityContext";

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

const App = ({ children }) => {
  const { setOnlineStatus } = useNetworkActivityContext();

  const handleGainConnection = useCallback(() => setOnlineStatus(true), [
    setOnlineStatus,
  ]);
  const handleLoseConnection = useCallback(() => setOnlineStatus(false), [
    setOnlineStatus,
  ]);

  useEffect(() => {
    window.addEventListener("online", handleGainConnection);
    window.addEventListener("offline", handleLoseConnection);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleGainConnection);
      window.removeEventListener("offline", handleLoseConnection);
    };
  });

  return (
    <ThemeProvider theme={theme}>
      {children}
      <GlobalStyle />
    </ThemeProvider>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
