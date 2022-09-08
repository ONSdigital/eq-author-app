import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import IconText from "components/IconText";
import WarningIcon from "./icon-warning.svg?inline";

const Banner = styled.div`
  background-color: ${colors.red};
  height: 5em;
  display: flex;
  /* flex: 100%; */
`;

const WarningMessage = styled(IconText)`
  display: flex;
  color: ${colors.white};
  /* animation: ${fade} 750ms ease-in forwards; */
  padding: 1em;
  /* margin-right: 60em; */
  /* margin-bottom: 2em; */
  font-weight: bold;
`;

const BannerMessage = styled.ul`
  color: ${colors.white};
`;

const Content = styled.p``;

const WarningBanner = ({ bannerMessage, children }) => {
  return (
    <Banner>
      <WarningMessage icon={WarningIcon}>{children}</WarningMessage>
      <BannerMessage>
        <Content>{bannerMessage}</Content>
      </BannerMessage>
    </Banner>
  );
};

export default WarningBanner;
