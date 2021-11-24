import React from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import PropType from "prop-types";
import { themes } from "constants/theme";

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
    font-size: ${({ theme }) => theme.fontSize};
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: ${({ theme }) => theme.fonts};
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

const Theme = ({ children, themeName }) => {
  return (
    <ThemeProvider theme={themes[themeName]}>
      {children}
      <GlobalStyle />
    </ThemeProvider>
  );
};

Theme.propTypes = {
  children: PropType.node,
  themeName: PropType.string,
};

Theme.defaultProps = {
  themeName: "default",
};

export default Theme;
