import React from "react";
import { ThemeProvider } from "styled-components";
import PropType from "prop-types";
import { themes } from "constants/theme";

const Theme = ({ children, themeName }) => {
  return <ThemeProvider theme={themes[themeName]}>{children}</ThemeProvider>;
};

Theme.propTypes = {
  children: PropType.node,
  themeName: PropType.string,
};

Theme.defaultProps = {
  themeName: "default",
};

export default Theme;
