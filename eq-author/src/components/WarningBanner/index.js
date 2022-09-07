import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

const Banner = styled.div`
  background-color: ${colors.red};
  height: 6em;
`;

const WarningBanner = ({ children }) => {
  return <Banner>{children}</Banner>;
};

export default WarningBanner;
