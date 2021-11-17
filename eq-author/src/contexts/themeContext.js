import React from "react";
import { ThemeProvider } from "styled-components";
import PropType from "prop-types";
import { themes } from "../constants/theme";
import { useMe } from "../App/MeContext";

const Theme = ({ children, themeName }) => {
  const meContext = useMe();
  const myTheme = meContext?.me?.theme;
  return (
    <ThemeProvider theme={themes[themeName || myTheme || "default"]}>
      {children}
    </ThemeProvider>
  );
};

Theme.propTypes = {
  children: PropType.node,
  themeName: PropType.string,
};

export default Theme;
