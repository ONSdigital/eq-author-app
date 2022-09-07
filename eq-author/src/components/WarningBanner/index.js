import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

const Banner = styled.div`
  background-color: ${colors.red};
  height: 1em;
`;

// const WarningBanner = (children) => {
//   return <Banner>{children}</Banner>;
// };

const WarningBanner = (children) => {
  return <Banner />;
};

export default WarningBanner;
